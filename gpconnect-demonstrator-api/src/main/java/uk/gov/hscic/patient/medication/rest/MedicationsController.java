/*
 *  Copyright 2015 Ripple OSI
 *
 *      Licensed under the Apache License, Version 2.0 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 *
 */
package uk.gov.hscic.patient.medication.rest;

import java.util.List;

import uk.gov.hscic.common.types.RepoSource;
import uk.gov.hscic.common.types.RepoSourceType;
import uk.gov.hscic.patient.medication.model.MedicationDetails;
import uk.gov.hscic.patient.medication.model.MedicationHeadline;
import uk.gov.hscic.patient.medication.model.MedicationSummary;
import uk.gov.hscic.patient.medication.search.MedicationSearch;
import uk.gov.hscic.patient.medication.search.MedicationSearchFactory;
import uk.gov.hscic.patient.medication.store.MedicationStore;
import uk.gov.hscic.patient.medication.store.MedicationStoreFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 */
@RestController
@RequestMapping("/patients/{patientId}/medications")
public class MedicationsController {

    @Autowired
    private MedicationSearchFactory medicationSearchFactory;

    @Autowired
    private MedicationStoreFactory medicationStoreFactory;

    @RequestMapping(method = RequestMethod.GET)
    public List<MedicationSummary> findAllMedications(@PathVariable("patientId") String patientId,
                                                      @RequestParam(required = false) String source) {
        final RepoSource sourceType = RepoSourceType.fromString(source);
        final MedicationSearch medicationSearch = medicationSearchFactory.select(sourceType);

        return medicationSearch.findAllMedication(patientId);
    }

    @RequestMapping(value = "/headlines", method = RequestMethod.GET)
    public List<MedicationHeadline> findMedicationHeadlines(@PathVariable("patientId") String patientId,
                                                            @RequestParam(required = false) String source) {
        final RepoSource sourceType = RepoSourceType.fromString(source);
        final MedicationSearch medicationSearch = medicationSearchFactory.select(sourceType);

        return medicationSearch.findMedicationHeadlines(patientId);
    }

    @RequestMapping(value = "/{medicationId}", method = RequestMethod.GET)
    public MedicationDetails findMedication(@PathVariable("patientId") String patientId,
                                            @PathVariable("medicationId") String medicationId,
                                            @RequestParam(required = false) String source) {
        final RepoSource sourceType = RepoSourceType.fromString(source);
        final MedicationSearch medicationSearch = medicationSearchFactory.select(sourceType);

        return medicationSearch.findMedication(patientId, medicationId);
    }

    @RequestMapping(method = RequestMethod.POST)
    public void createMedication(@PathVariable("patientId") String patientId,
                                 @RequestParam(required = false) String source,
                                 @RequestBody MedicationDetails medication) {
        final RepoSource sourceType = RepoSourceType.fromString(source);
        final MedicationStore medicationStore = medicationStoreFactory.select(sourceType);

        medicationStore.create(patientId, medication);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public void updateMedication(@PathVariable("patientId") String patientId,
                                 @RequestParam(required = false) String source,
                                 @RequestBody MedicationDetails medication) {
        final RepoSource sourceType = RepoSourceType.fromString(source);
        final MedicationStore medicationStore = medicationStoreFactory.select(sourceType);

        medicationStore.update(patientId, medication);
    }
}