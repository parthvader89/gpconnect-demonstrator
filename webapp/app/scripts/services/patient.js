'use strict';

angular.module('gpConnect').factory('PatientService', ['$rootScope', '$http', 'FhirEndpointLookup', '$cacheFactory', 'fhirJWTFactory', 'ProviderRouting', 'gpcResource', function ($rootScope, $http, FhirEndpointLookup, $cacheFactory, fhirJWTFactory, ProviderRouting, gpcResource) {
    var findAllSummaries = function () {
        return $http.get(ProviderRouting.defaultPractice().apiEndpointURL + '/patients');
    };
    
    var getSummary = function (patientId) {
        return FhirEndpointLookup.getEndpoint($rootScope.patientOdsCode, "urn:nhs:names:services:gpconnect:fhir:operation:gpc.getcarerecord-1").then(function (response) {
            var endpointLookupResult = response;
            
            return $http.post(
                endpointLookupResult.restUrlPrefix + '/Patient/$gpc.getcarerecord',
                '{"resourceType" : "Parameters","parameter" : [{"name" : "patientNHSNumber","valueIdentifier" : { "system": "' + gpcResource.getConst("ID_NHS_NUMBER") + '", "value" : "' + patientId + '" }},{"name" : "recordSection","valueCodeableConcept" :{"coding" : [{"system":"' + gpcResource.getConst("VS_GPC_RECORD_SECTION") + '","code":"SUM","display":"Summary"}]}},{"name" : "timePeriod","valuePeriod" : { "start" : null, "end" : null }}]}',
                {
                    headers: {
                        'Ssp-From': endpointLookupResult.fromASID,
                        'Ssp-To': endpointLookupResult.toASID,
                        'Ssp-InteractionID': "urn:nhs:names:services:gpconnect:fhir:operation:gpc.getcarerecord-1",
                        'Ssp-TraceID': fhirJWTFactory.guid(),
                        'Authorization': "Bearer " + fhirJWTFactory.getJWT("patient", "read", patientId),
                        'Accept': "application/fhir+json",
                        'Content-Type': "application/fhir+json"
                    }
                }
            );
        });
    };
    
    /**
     * takes an optional ods code or uses the one from rootScope
     * @param {type} patientId
     * @param {type} odsCode
     * @returns {unresolved}
     */
    var getPatientFhirId = function (patientId, odsCode) {
        var odsCode = (typeof odsCode !== 'undefined') ? odsCode : $rootScope.patientOdsCode;
        
        return FhirEndpointLookup.getEndpoint(odsCode, "urn:nhs:names:services:gpconnect:fhir:rest:search:patient-1").then(function (endpointResponse) {
            var endpointLookupResult = endpointResponse;
            
            var partientLookupResponse = $http.get(
                endpointLookupResult.restUrlPrefix + '/Patient?identifier=' + gpcResource.getConst("ID_NHS_NUMBER") + '%7C' + patientId,
                {
                    headers: {
                        'Ssp-From': endpointLookupResult.fromASID,
                        'Ssp-To': endpointLookupResult.toASID,
                        'Ssp-InteractionID': "urn:nhs:names:services:gpconnect:fhir:rest:search:patient-1",
                        'Ssp-TraceID': fhirJWTFactory.guid(),
                        'Authorization': "Bearer " + fhirJWTFactory.getJWT("patient", "read", patientId),
                        'Accept': "application/fhir+json"
                    }
                }
            ).then(function (response) {
                if (response.data.entry != undefined) {
                    return response.data.entry[0].resource.id;
                } else {
                    return undefined;
                }
            });
            
            return partientLookupResponse;
        });
    };
    
    /**
     * sets rootScope patientOdsCode
     * @param {type} practiceOdsCode
     * @param {type} patientId
     * @returns {unresolved}
     */
    var getFhirPatient = function (practiceOdsCode, patientId) {
        var response;
        $rootScope.patientOdsCode = practiceOdsCode;
        
        return FhirEndpointLookup.getEndpoint(practiceOdsCode, "urn:nhs:names:services:gpconnect:fhir:rest:search:patient-1").then(function (response) {
            var endpointLookupResult = response;
            var response = $http.get(
                endpointLookupResult.restUrlPrefix + '/Patient?identifier=' + gpcResource.getConst("ID_NHS_NUMBER") + '%7C' + patientId,
                {
                    headers: {
                        'Ssp-From': endpointLookupResult.fromASID,
                        'Ssp-To': endpointLookupResult.toASID,
                        'Ssp-InteractionID': "urn:nhs:names:services:gpconnect:fhir:rest:search:patient-1",
                        'Ssp-TraceID': fhirJWTFactory.guid(),
                        'Authorization': "Bearer " + fhirJWTFactory.getJWT("patient", "read", patientId),
                        'Accept': "application/fhir+json"
                    }
                }
            ).then(function (response) {
                if (response.data != undefined && response.data.entry != undefined) {
                    return response.data.entry[0].resource;
                } else {
                    return undefined;
                }
            });
            
            return response;
        });
    };
    
    var registerPatient = function (practiceOdsCode, requestParameters, patientId) {
        return FhirEndpointLookup.getEndpoint(practiceOdsCode, "urn:nhs:names:services:gpconnect:fhir:operation:gpc.registerpatient-1").then(function (endpointLookupResult) {
            return $http.post(
                endpointLookupResult.restUrlPrefix + '/Patient/$gpc.registerpatient', requestParameters,
                {
                    headers: {
                        'Ssp-From': endpointLookupResult.fromASID,
                        'Ssp-To': endpointLookupResult.toASID,
                        'Ssp-InteractionID': "urn:nhs:names:services:gpconnect:fhir:operation:gpc.registerpatient-1",
                        'Ssp-TraceID': fhirJWTFactory.guid(),
                        'Authorization': "Bearer " + fhirJWTFactory.getJWT("patient", "write", patientId),
                        'Accept': "application/fhir+json",
                        'Content-Type': "application/fhir+json"
                    }
                }
            ).then(function (response) {
                return response.data;
            });
        });
    };
    
    var medication = function(patientId) {
        return FhirEndpointLookup.getEndpoint($rootScope.patientOdsCode, "urn:nhs:names:services:gpconnect:fhir:operation:gpc.getstructuredrecord-1").then(function(response) {
            var endpointLookupResult = response;
            return $http.post(
                endpointLookupResult.restUrlPrefix + '/Patient/$gpc.getstructuredrecord',
                '{"resourceType" : "Parameters","parameter" : [{"name" : "patientNHSNumber","valueIdentifier" : { "system": "'+gpcResource.getConst("ID_NHS_NUMBER")+'", "value" : "' + patientId + '" }},{"name":"includeMedication","part":[{"name":"medicationSearchFromDate","valueDate":"2012-02-02"}]}]}',
                
                
                {
                    headers: {
                        'Ssp-From': endpointLookupResult.fromASID,
                        'Ssp-To': endpointLookupResult.toASID,
                        'Ssp-InteractionID': "urn:nhs:names:services:gpconnect:fhir:operation:gpc.getstructuredrecord-1",
                        'Ssp-TraceID': fhirJWTFactory.guid(),
                        'Authorization': "Bearer " + fhirJWTFactory.getJWT("patient", "read", patientId),
                        'Accept': "application/fhir+json",
                        'Content-Type': "application/fhir+json"
                    }
                }
            ).then(function(response) {
                return response.data;
            });
        });
    };
    
    
    var structured = function (patientId, start, includePrescriptionIssues, includeResolvedAllergies) {
        return FhirEndpointLookup.getEndpoint($rootScope.patientOdsCode, "urn:nhs:names:services:gpconnect:fhir:operation:gpc.getstructuredrecord-1").then(function (response) {
            var endpointLookupResult = response;
            
            var includeResolvedAllergiesPart = '"part": [{"name":"includeResolvedAllergies",  "valueBoolean":'+includeResolvedAllergies+'}]'
            var dateFrom = "";
            if(start !== ""){
                start = start === "" ? null : start;
                dateFrom = '{"name":"medicationSearchFromDate", "valueDate" :' + start + '},';
            }
            var includeMedication =  '{"name" : "includeMedication","part": [' + dateFrom + '{"name":"includePrescriptionIssues", "valueBoolean" : ' + includePrescriptionIssues + '}]}';
            var body = '{"resourceType" : "Parameters","parameter" : [{"name" : "patientNHSNumber","valueIdentifier" : { "system": "' + gpcResource.getConst("ID_NHS_NUMBER") + '", "value" : "' + patientId + '" }},{"name" : "includeAllergies",'+includeResolvedAllergiesPart+'},'+includeMedication+']}';        
            
            return $http.post(
                endpointLookupResult.restUrlPrefix + '/Patient/$gpc.getstructuredrecord',
                body,
                {
                    headers: {
                        'Ssp-From': endpointLookupResult.fromASID,
                        'Ssp-To': endpointLookupResult.toASID,
                        'Ssp-InteractionID': "urn:nhs:names:services:gpconnect:fhir:operation:gpc.getstructuredrecord-1",
                        'Ssp-TraceID': fhirJWTFactory.guid(),
                        'Authorization': "Bearer " + fhirJWTFactory.getJWT("patient", "read", patientId),
                        'Accept': "application/fhir+json",
                        'Content-Type': "application/fhir+json"
                    }
                }
            ).then(function (response) {
                return response.data;
            });
        });
    };
    
    
    var allMedications = function (patientId) {
        return $http.get(ProviderRouting.defaultPractice().apiEndpointURL + '/medication/all/'+patientId).then(function (response) {
            return response.data;
        });
        
    };
    
    var allergyDetialsByPatient = function(patientId) {
        return $http.get(ProviderRouting.defaultPractice().apiEndpointURL + '/allergy/'+patientId).then(function (response) {
            return response.data;
        });
    };
    
    var addMedication = function(data) {
        return $http.put(ProviderRouting.defaultPractice().apiEndpointURL + '/medication/add',data).then(function(response) {
            return response.data;
        });
    };

    var getPractitioner = function (practiceOdsCode, practitionerId) {
       
        return FhirEndpointLookup.getEndpoint(practiceOdsCode, "urn:nhs:names:services:gpconnect:fhir:rest:read:practitioner-1").then(function (response) {
            var endpointLookupResult = response;
            var response = $http.get(
                endpointLookupResult.restUrlPrefix + '/Practitioner/'+practitionerId,
                {
                    headers: {
                        'Ssp-From': endpointLookupResult.fromASID,
                        'Ssp-To': endpointLookupResult.toASID,
                        'Ssp-InteractionID': "urn:nhs:names:services:gpconnect:fhir:rest:read:practitioner-1",
                        'Ssp-TraceID': fhirJWTFactory.guid(),
                        'Authorization': "Bearer " + fhirJWTFactory.getJWT("patient", "read", practitionerId),
                        'Accept': "application/fhir+json"
                    }
                }
            ).then(function (response) {
                if (response.data != undefined) {
                    return response.data;
                } else {
                    return undefined;
                }
            });
            
            return response;
        });
    };

    
        
    return {
        findAllSummaries: findAllSummaries,
        getSummary: getSummary,
        getPatientFhirId: getPatientFhirId,
        getFhirPatient: getFhirPatient,
        structured: structured,
        registerPatient: registerPatient,
        medication:medication,
        allMedications:allMedications,
        allergyDetialsByPatient:allergyDetialsByPatient,
        addMedication:addMedication,
        getPractitioner:getPractitioner
    };
}]);
