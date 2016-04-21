/*
 * Copyright 2015 Ripple OSI
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package uk.gov.hscic.patient.problems.search;

import java.util.List;

import org.hl7.fhir.instance.model.Condition;
import uk.gov.hscic.common.exception.ConfigurationException;
import uk.gov.hscic.common.types.RepoSourceType;
import uk.gov.hscic.patient.problems.model.ProblemDetails;
import uk.gov.hscic.patient.problems.model.ProblemHeadline;
import uk.gov.hscic.patient.problems.model.ProblemSummary;

/**
 */
public class NotConfiguredProblemSearch implements ProblemSearch {

    @Override
    public RepoSourceType getSource() {
        return RepoSourceType.NONE;
    }

    @Override
    public int getPriority() {
        return Integer.MAX_VALUE;
    }

    @Override
    public List<ProblemHeadline> findProblemHeadlines(String patientId) {
        throw ConfigurationException.unimplementedTransaction(ProblemSearch.class);
    }

    @Override
    public List<ProblemSummary> findAllProblems(String patientId) {
        throw ConfigurationException.unimplementedTransaction(ProblemSearch.class);
    }

    @Override
    public ProblemDetails findProblem(String patientId, String problemId) {
        throw ConfigurationException.unimplementedTransaction(ProblemSearch.class);
    }

    @Override
    public List<Condition> findAllFhirConditions(String patientId) {
        throw ConfigurationException.unimplementedTransaction(ProblemSearch.class);
    }

    @Override
    public Condition findFhirCondition(String patientId, String conditionId) {
        throw ConfigurationException.unimplementedTransaction(ProblemSearch.class);
    }
}