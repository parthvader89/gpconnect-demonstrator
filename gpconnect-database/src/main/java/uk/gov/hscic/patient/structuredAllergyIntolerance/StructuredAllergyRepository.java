package uk.gov.hscic.patient.structuredAllergyIntolerance;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import uk.gov.hscic.patient.allergies.AllergyEntity;

public interface StructuredAllergyRepository extends JpaRepository<StructuredAllergyIntoleranceEntity, Long> {
	 List<StructuredAllergyIntoleranceEntity> findByNhsNumber(String patientId);
}
