#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("path");
var xml2js_1 = require("xml2js");
// 2. Parse command-line args
var _a = process.argv, _b = _a[2], xmlFilePath = _b === void 0 ? 'test-results.xml' : _b;
// 3. Define known epics (example)
var KNOWN_EPICS = ['@PO-1111', '@PO-2222', '@PO-3333'];
// 4. Read & parse the XML
var rawXml = fs.readFileSync(xmlFilePath, 'utf-8');
(0, xml2js_1.parseString)(rawXml, function (err, result) {
    if (err) {
        console.error('Failed to parse XML:', err);
        process.exit(1);
    }
    // Attempt to extract test suite arrays
    var testSuites = [];
    if (result.testsuites && result.testsuites.testsuite) {
        // If there's an array of <testsuite>:
        testSuites = result.testsuites.testsuite;
    }
    else if (result.testsuite) {
        // If top-level is <testsuite> or array of them
        testSuites = Array.isArray(result.testsuite) ? result.testsuite : [result.testsuite];
    }
    else {
        console.error('No <testsuite> elements found in parsed XML.');
        process.exit(1);
    }
    // 5. Convert the raw parsed data to our structured TestSuite array
    var totalPasses = 0;
    var totalFailures = 0;
    var suiteData = testSuites.map(function (suite) {
        var _a = suite.$, name = _a.name, _b = _a.timestamp, timestamp = _b === void 0 ? '' : _b, _c = _a.tests, tests = _c === void 0 ? '0' : _c, _d = _a.failures, failures = _d === void 0 ? '0' : _d, _e = _a.time, time = _e === void 0 ? '0' : _e;
        var totalTests = parseInt(tests, 10);
        var failureCount = parseInt(failures, 10);
        var duration = parseFloat(time);
        totalPasses += totalTests - failureCount;
        totalFailures += failureCount;
        // Parse testcases
        var testcases = (suite.testcase || []).map(function (tc) {
            var testName = tc.$.name;
            var testTime = parseFloat(tc.$.time || '0');
            var status = 'pass';
            var failureMessage = '';
            if (tc.failure) {
                status = 'fail';
                failureMessage = tc.failure[0]._;
            }
            else if (tc.error) {
                status = 'fail';
                failureMessage = tc.error[0]._;
            }
            // Extract tags from format [@SOMETHING]
            var tagRegex = /\[@([^\]]+)\]/g;
            var tagsFound = [];
            var match;
            while ((match = tagRegex.exec(testName)) !== null) {
                tagsFound.push('@' + match[1]);
            }
            // Split epics vs other tags
            var epics = [];
            var otherTags = [];
            tagsFound.forEach(function (tag) {
                if (KNOWN_EPICS.includes(tag)) {
                    epics.push(tag);
                }
                else {
                    otherTags.push(tag);
                }
            });
            var tcData = {
                name: testName,
                time: testTime,
                status: status,
                failureMessage: failureMessage,
                epics: epics,
                tags: otherTags,
            };
            return tcData;
        });
        return {
            name: name,
            timestamp: timestamp,
            totalTests: totalTests,
            failures: failureCount,
            time: duration,
            testcases: testcases,
        };
    });
    // 6. Generate the final HTML
    var html = generateHTML(suiteData, totalPasses, totalFailures);
    // 7. Write HTML to file
    var outputPath = path_1.default.join(process.cwd(), 'test-report.html');
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log("HTML report generated: ".concat(outputPath));
});
/**
 * Generates the top-level HTML. In this version, we reference external CSS and JS files
 * instead of embedding them directly in the HTML.
 */
function generateHTML(suiteData, totalPasses, totalFailures) {
    return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\"/>\n  <title>Mocha Test Report</title>\n  <!-- Link external CSS file -->\n  <link rel=\"stylesheet\" href=\"report-style.css\">\n</head>\n<body>\n  <div class=\"summary\">\n    <h1>Mocha Test Report</h1>\n    <p>Total Passes: <strong>".concat(totalPasses, "</strong> &nbsp;|&nbsp;\n       Total Failures: <strong>").concat(totalFailures, "</strong></p>\n  </div>\n  <div class=\"suite-accordion\">\n    ").concat(suiteData.map(createSuiteAccordionItem).join(''), "\n  </div>\n\n  <!-- Script to be loaded externally -->\n  <script src=\"report-script.js\"></script>\n</body>\n</html>\n  ");
}
/**
 * Creates an accordion item for each test suite.
 */
function createSuiteAccordionItem(suite) {
    var name = suite.name, totalTests = suite.totalTests, failures = suite.failures, time = suite.time, testcases = suite.testcases;
    var passes = totalTests - failures;
    return "\n    <div class=\"accordion-item\">\n      <div class=\"accordion-header\">\n        ".concat(escapeHtml(name), "\n        &nbsp; (Passes: ").concat(passes, ", Failures: ").concat(failures, ", Time: ").concat(time.toFixed(2), "s)\n      </div>\n      <div class=\"accordion-content\">\n        <input type=\"text\" class=\"filter-input\" placeholder=\"Filter test cases...\"/>\n        <table>\n          <thead>\n            <tr>\n              <th>Name</th>\n              <th>Status</th>\n              <th>Duration (s)</th>\n              <th>Epics</th>\n              <th>Tags</th>\n            </tr>\n          </thead>\n          <tbody>\n            ").concat(testcases.map(createTestCaseRow).join(''), "\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ");
}
/**
 * Create a single row for a test case.
 */
function createTestCaseRow(tc) {
    var name = tc.name, status = tc.status, time = tc.time, epics = tc.epics, tags = tc.tags;
    return "\n    <tr class=\"".concat(status, "\">\n      <td>").concat(escapeHtml(name), "</td>\n      <td>").concat(status, "</td>\n      <td>").concat(time.toFixed(3), "</td>\n      <td>").concat(epics.join(', '), "</td>\n      <td>").concat(tags.join(', '), "</td>\n    </tr>\n  ");
}
/**
 * Utility to escape HTML special chars
 */
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
