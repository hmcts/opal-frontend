#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';

/** Data structures for final typed output. */
interface TestCase {
  name: string; // Test case name (without suite name)
  time: number;
  status: 'Pass' | 'Fail';
  failureMessage: string;
  epics: string[];
  tags: string[];
}

interface TestSuite {
  originalName: string; // The raw suite name from the XML
  name: string; // The suite name WITHOUT bracketed tags
  timestamp: string;
  totalTests: number;
  failures: number;
  time: number;
  epics: string[]; // Suite-level epics (extracted from suite name)
  tags: string[]; // Suite-level tags (extracted from suite name)
  testcases: TestCase[];
}

/** XML-to-TS interfaces for intermediate parsing. */
interface XmlTestSuite {
  $: {
    name: string;
    timestamp?: string;
    tests?: string;
    failures?: string;
    time?: string;
  };
  testcase?: Array<{
    $: {
      name: string;
      time?: string;
    };
    failure?: Array<{ _: string }>;
    error?: Array<{ _: string }>;
  }>;
}

interface XmlTestSuites {
  $: {
    tests?: string;
    failures?: string;
    time?: string;
  };
  testsuite?: XmlTestSuite[];
}

interface ParsedXml {
  testsuites?: XmlTestSuites;
  testsuite?: XmlTestSuite | XmlTestSuite[];
}

/** Known epics for categorizing which tags are epics vs. normal tags. */
const KNOWN_EPICS: string[] = ['@PO-1111', '@PO-2222', '@PO-3333', '@PO-272', '@PO-344'];

/** Grab the input file path from CLI arguments (default: test-results.xml). */
const [, , xmlFilePath = 'test-results.xml'] = process.argv;

/** Read and parse the XML file. */
const rawXml = fs.readFileSync(xmlFilePath, 'utf-8');
parseString(rawXml, (err: Error | null, result: ParsedXml) => {
  if (err) {
    console.error('Failed to parse XML:', err);
    process.exit(1);
  }

  // Attempt to extract an array of <testsuite> from the parsed object
  let testSuites: XmlTestSuite[] = [];
  if (result.testsuites && result.testsuites.testsuite) {
    // Multiple <testsuite> under <testsuites>
    testSuites = result.testsuites.testsuite;
  } else if (result.testsuite) {
    // Single top-level <testsuite>, or array of them
    testSuites = Array.isArray(result.testsuite) ? result.testsuite : [result.testsuite];
  } else {
    console.error('No <testsuite> elements found in parsed XML.');
    process.exit(1);
  }

  // Convert to our typed structure
  const suiteData: TestSuite[] = testSuites.map((suiteXml) => {
    const { name: rawSuiteName, timestamp = '', tests = '0', failures = '0', time = '0' } = suiteXml.$;
    const totalTests = parseInt(tests, 10) || 0;
    const failureCount = parseInt(failures, 10) || 0;
    const duration = parseFloat(time) || 0;

    // 1) Parse bracketed tags from the suite’s own name
    const suiteEpics: string[] = [];
    const suiteTags: string[] = [];
    const bracketRegex = /\[@([^\]]+)\]/g;
    let suiteMatch: RegExpExecArray | null;

    while ((suiteMatch = bracketRegex.exec(rawSuiteName)) !== null) {
      // e.g. match[1] = "PO-NOT_EPIC, @PO-1111"
      const bracketContent = suiteMatch[1];
      bracketContent
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((tagString) => {
          const finalTag = tagString.startsWith('@') ? tagString : '@' + tagString;
          if (KNOWN_EPICS.includes(finalTag)) {
            suiteEpics.push(finalTag);
          } else {
            suiteTags.push(finalTag);
          }
        });
    }

    // 2) Remove bracket content from the displayed suite name
    const cleanedSuiteName = rawSuiteName.replace(/\[@[^\]]+\]/g, '').trim();

    // 3) Parse testcases
    const testcases: TestCase[] = (suiteXml.testcase || []).map((tc) => {
      const originalName = tc.$.name;
      const testTime = parseFloat(tc.$.time || '0');
      let status: 'Pass' | 'Fail' = 'Pass';
      let failureMessage = '';

      if (tc.failure) {
        status = 'Fail';
        failureMessage = tc.failure[0]._;
      } else if (tc.error) {
        status = 'Fail';
        failureMessage = tc.error[0]._;
      }

      // Identify bracketed tags ([@ ... ]) in the test name
      const testBracketsRegex = /\[@([^\]]+)\]/g;
      let match: RegExpExecArray | null;
      const tagsFound: string[] = [];

      while ((match = testBracketsRegex.exec(originalName)) !== null) {
        // e.g. match[1] = "PO-2222, @PO-3333, @SOMETHING"
        const bracketContent = match[1];
        bracketContent
          .split(',')
          .map((str) => str.trim())
          .filter(Boolean)
          .forEach((tagString) => {
            const finalTag = tagString.startsWith('@') ? tagString : '@' + tagString;
            tagsFound.push(finalTag);
          });
      }

      // Separate epics from other tags at test-case level
      const epics: string[] = [];
      const otherTags: string[] = [];
      tagsFound.forEach((tag) => {
        if (KNOWN_EPICS.includes(tag)) {
          epics.push(tag);
        } else {
          otherTags.push(tag);
        }
      });

      // Remove bracketed tags from the displayed test name
      const testNameWithoutTags = originalName.replace(/\[@[^\]]+\]/g, '').trim();

      return {
        name: testNameWithoutTags,
        time: testTime,
        status,
        failureMessage,
        epics,
        tags: otherTags,
      };
    });

    return {
      originalName: rawSuiteName,
      name: cleanedSuiteName,
      timestamp,
      totalTests,
      failures: failureCount,
      time: duration,
      epics: suiteEpics,
      tags: suiteTags,
      testcases,
    };
  });

  // Generate the HTML (with inline CSS & JS)
  const html = generateHTML(suiteData);
  // Write to a file
  const outputPath = path.join(process.cwd(), 'cypress/reports/reportGenerator/test-report.html');
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`HTML report generated: ${outputPath}`);
});

/**
 * Reads local "report-style.css" and "report-script.js" then returns them as strings.
 * We'll inline them in the final HTML, so there's no external dependency.
 */
function getInlineResources(): { inlineCSS: string; inlineJS: string } {
  const baseDir = __dirname;
  let inlineCSS = '';
  let inlineJS = '';

  try {
    inlineCSS = fs.readFileSync(path.join(baseDir, 'report-style.css'), 'utf-8');
  } catch (cssErr) {
    console.warn('Could not read "report-style.css":', cssErr);
  }

  try {
    inlineJS = fs.readFileSync(path.join(baseDir, 'report-script.js'), 'utf-8');
  } catch (jsErr) {
    console.warn('Could not read "report-script.js":', jsErr);
  }

  return { inlineCSS, inlineJS };
}

/**
 * Generates HTML with a single table:
 * - One "suite row" for each suite (showing suite name, pass/fail, duration, SUITE-LEVEL epics/tags)
 * - Indented "test case rows" beneath that suite row
 */
function generateHTML(suiteData: TestSuite[]): string {
  const { inlineCSS, inlineJS } = getInlineResources();

  // Build all table rows
  const tableRows = suiteData
    .map((suite) => {
      const passCount = suite.totalTests - suite.failures;
      const failCount = suite.failures;

      // Create a row for the suite
      const suiteRow = `
        <tr class="suite-row">
          <td><strong>Suite: ${escapeHtml(suite.name)}</strong></td>
          <td class="status-cell">
            Pass: ${passCount}
            <br>
            Fail: ${failCount}
          </td>
          <td>${suite.time.toFixed(2)}</td>
          <td>${suite.epics.join('<br>')}</td>
          <td>${suite.tags.join('<br>')}</td>
        </tr>
      `;

      // Then rows for each test case
      const testCaseRows = suite.testcases
        .map((tc) => {
          return `
            <tr class="${tc.status}">
              <td class="testcase-name">${escapeHtml(tc.name)}</td>
              <td class="status-cell">${tc.status}</td>
              <td>${tc.time.toFixed(3)}</td>
              <td>${tc.epics.join('<br>')}</td>
              <td>${tc.tags.join('<br>')}</td>
            </tr>
          `;
        })
        .join('');

      return suiteRow + testCaseRows;
    })
    .join('');

  // Calculate totals across all suites
  let totalTests = 0;
  let totalFailures = 0;
  suiteData.forEach((s) => {
    totalTests += s.totalTests;
    totalFailures += s.failures;
  });
  const totalPasses = totalTests - totalFailures;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Opal Frontend Test Report</title>
  <style>
${inlineCSS}
  </style>
</head>
<body>
  <div class="summary">
    <h1>Opal Frontend Test Report</h1>
    <p>Total Passes: <strong>${totalPasses}</strong> &nbsp;|&nbsp;
       Total Failures: <strong>${totalFailures}</strong></p>
  </div>

  <!-- Global filter (search) for the entire table -->
  <input type="text" id="global-filter" placeholder="Search all test cases..."
         style="margin-bottom: 10px; padding: 5px; width: 300px;" />
<button id="copy-table-btn" class="copy-btn">Copy Table</button>
<button id="copy-html-btn" class="copy-btn">Copy Page HTML</button>

  <table id="main-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Duration (s)</th>
        <th>Epics</th>
        <th>Tags</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <script>
${inlineJS}
  </script>
</body>
</html>
  `;
}

/** Minimal HTML-escaping utility. */
function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
