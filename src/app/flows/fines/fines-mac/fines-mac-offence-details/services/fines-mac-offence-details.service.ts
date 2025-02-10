import { Injectable } from '@angular/core';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesMacOffenceDetailsService {
  /**
   * Reorders the imposition keys to maintain correct numbering.
   *
   * @param impositions - The array of impositions to be reordered.
   * @returns The reordered array of impositions.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reorderImpositionKeys(impositions: any[]): any[] {
    return impositions.map((imposition, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newImposition: any = {};
      for (const key of Object.keys(imposition)) {
        const newKey = key.replace(/_\d+$/, `_${index}`); // Replace index suffix with new index
        newImposition[newKey] = imposition[key];
      }
      return newImposition;
    });
  }

  /**
   * Updates child form data to adjust imposition positions after an imposition is removed.
   *
   * @param offence - The offence object containing the child form data.
   * @param removedIndex - The index of the removed imposition.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private updateChildFormData(offence: any, removedIndex: number): void {
    if (!offence.childFormData) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offence.childFormData.forEach((child: any) => {
      if (child.formData.fm_offence_details_imposition_position === removedIndex) {
        // Remove the childFormData entry if it matches the removed index
        offence.childFormData = offence.childFormData.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any) => c.formData.fm_offence_details_imposition_position !== removedIndex,
        );
      } else if (child.formData.fm_offence_details_imposition_position > removedIndex) {
        // Decrement imposition_position for remaining childFormData
        child.formData.fm_offence_details_imposition_position--;
      }
    });
  }

  /**
   * Removes an imposition from the specified offence in the data array.
   *
   * @param data - The array of offence data objects.
   * @param offenceIndex - The index of the offence in the data array.
   * @param impositionIndex - The index of the imposition to be removed within the offence.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeImposition(data: any[], impositionIndex: number, offenceIndex: number = 0): any {
    if (!data?.length) return;

    const offence = data[offenceIndex];
    const impositions = offence?.formData?.fm_offence_details_impositions;
    if (!impositions || impositionIndex < 0 || impositionIndex >= impositions.length) return;

    // Remove the imposition at the given index
    impositions.splice(impositionIndex, 1);

    // Reorder the remaining impositions by renaming keys to maintain correct numbering
    offence.formData.fm_offence_details_impositions = this.reorderImpositionKeys(impositions);

    // Update childFormData
    this.updateChildFormData(offence, impositionIndex);

    return data;
  }

  public removeIndexFromImpositionKey(forms: IFinesMacOffenceDetailsForm[]) {
    const uniqueDates = new Set<string>(); // Track unique dates of offence
    return forms.map((form) => {
      const dateOfOffence = form.formData.fm_offence_details_date_of_sentence;

      let show_date_of_sentence = false;
      if (dateOfOffence && !uniqueDates.has(dateOfOffence)) {
        show_date_of_sentence = true;
        uniqueDates.add(dateOfOffence);
      }

      return {
        formData: {
          ...form.formData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fm_offence_details_impositions: form.formData.fm_offence_details_impositions.map((imposition: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cleanedImposition: any = {};
            Object.keys(imposition).forEach((key) => {
              // Use regex to remove the _{{index}} from the key
              const newKey = key.replace(/_\d+$/, '');
              cleanedImposition[newKey] = imposition[key];
            });
            return cleanedImposition;
          }),
          show_date_of_sentence,
        },
        nestedFlow: form.nestedFlow,
        childFormData: form.childFormData,
      };
    });
  }
}
