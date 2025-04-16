import { useState } from 'react';
import { X, Loader, ShieldCheck, Download } from 'lucide-react';

export default function EmailViewer({ email, onClose }) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);

  const handleDecrypt = () => {
    setIsDecrypting(true);
    
    setTimeout(() => {
      setIsDecrypted(true);
      setIsDecrypting(false);
    }, 2000);
  };

  const handleDownload = (file) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full border border-gray-700 text-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
          <h2 className="text-lg font-medium text-gray-100">View Email</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Email metadata */}
        <div className="p-4 space-y-2 bg-gray-800">
          <div className="flex">
            <span className="w-16 font-medium text-gray-400">From:</span>
            <span className="text-gray-200">{email.from}</span>
          </div>
          <div className="flex">
            <span className="w-16 font-medium text-gray-400">To:</span>
            <span className="text-gray-200">{email.to}</span>
          </div>
          <div className="flex">
            <span className="w-16 font-medium text-gray-400">Date:</span>
            <span className="text-gray-200">{email.date}</span>
          </div>
        </div>
        
        {/* Email content */}
        <div className="p-4 bg-gray-900">
          {isDecrypting ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin mb-4 text-blue-400" size={36} />
              <p className="text-gray-300">Decrypting your message...</p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-medium mb-4 text-gray-100">
                {isDecrypted ? email.decryptedSubject || email.subject : email.subject}
              </h3>
              <div className="whitespace-pre-wrap text-gray-300 min-h-48">
                {isDecrypted ? email.decryptedBody : email.body}
              </div>
              
              {/* Attachments section */}
              {email.attachments && email.attachments.length > 0 && (
                <div className="mt-6 border-t border-gray-800 pt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Attachments</h4>
                  <div className="space-y-2">
                    {email.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-500/10 p-2 rounded-lg">
                            <Download size={16} className="text-blue-400" />
                          </div>
                          <div>
                            <p className="text-gray-200 text-sm">{file.name}</p>
                            <p className="text-gray-400 text-xs">{file.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(file)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center space-x-1"
                        >
                          <Download size={14} />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-between items-center bg-gray-800 rounded-b-lg">
          <div className="text-gray-400 text-sm">
            {email.encrypted ? (
              <div className="flex items-center">
                <ShieldCheck size={16} className="text-green-400 mr-1" />
                <span>End-to-end encrypted</span>
              </div>
            ) : (
              <div className="flex items-center">
                <ShieldCheck size={16} className="text-green-400 mr-1" />
                <span>Decrypted message</span>
              </div>
            )}
          </div>
          {email.encrypted && !isDecrypted && (
            <button
              onClick={handleDecrypt}
              disabled={isDecrypting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-500 flex items-center"
            >
              {isDecrypting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Decrypting...
                </>
              ) : (
                <>Decrypt Message</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}