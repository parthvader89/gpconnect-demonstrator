package uk.gov.hscic.common.config;

import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.RestfulServer;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import org.springframework.web.context.support.WebApplicationContextUtils;
import uk.gov.hscic.patient.resource.provider.PatientResourceProvider;

@WebServlet(urlPatterns={"/fhir/*"}, displayName="FHIR Server")
public class FhirRestfulServlet extends RestfulServer {
    
    private static final long serialVersionUID = 1L;
    
    @Override
    protected void initialize() throws ServletException {
        List<IResourceProvider> resourceProviders = new ArrayList<>();
        
        PatientResourceProvider patientResourceProvider = new PatientResourceProvider();
        patientResourceProvider.setApplicationContext(WebApplicationContextUtils.getWebApplicationContext(this.getServletContext()));
        resourceProviders.add(patientResourceProvider);
        
        setResourceProviders(resourceProviders);
    }
}
