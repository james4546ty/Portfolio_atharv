import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

export default function Certifications() {
  const { data: certificationsData, isLoading, isError } = useQuery<any[]>({
    queryKey: ['/api/certifications'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  if (isLoading) {
    return (
      <section id="certifications" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center">
            <p className="text-gray-400">Loading certifications...</p>
          </div>
        </div>
      </section>
    );
  }

  const certifications = certificationsData && certificationsData.length > 0 
    ? certificationsData 
    : [];

  return (
    <section id="certifications" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Certifications</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional certifications and job simulations from leading technology companies
            </p>
          </div>
          
          {isError ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">Failed to load certifications. Please try again later.</p>
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No certifications available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {certifications.map((cert) => (
                <div key={cert.id} className={`${cert.cardColor || 'bg-blue-500'} rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-105`}>
                  {/* Certificate Image */}
                  {cert.certImageUrl && (
                    <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
                      <img 
                        src={cert.certImageUrl} 
                        alt={`${cert.company || cert.title} Certificate`}
                        className="w-full h-auto rounded-lg"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Certificate Details */}
                  <div className="text-center">
                    <h3 className={`text-xl font-bold ${cert.titleColor || 'text-white'} mb-2`}>{cert.company || 'Certificate'}</h3>
                    <p className={`${cert.titleColor || 'text-white'} font-semibold mb-3`}>{cert.title}</p>
                    <div className={`space-y-1 ${cert.textColor || 'text-gray-100'} mb-6 text-sm`}>
                      <p><strong>Issued:</strong> {cert.issued} • <strong>Platform:</strong> {cert.platform}</p>
                    </div>
                    
                    {/* Show Credential Button */}
                    {cert.credentialUrl && (
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 ${cert.buttonColor || 'bg-white hover:bg-gray-100 text-blue-500'} py-2 px-6 rounded-lg font-medium transition-colors duration-300`}
                      >
                        <i className="fas fa-external-link-alt"></i>
                        Show Credential
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
