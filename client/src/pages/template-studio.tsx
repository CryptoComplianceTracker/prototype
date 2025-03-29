import React, { useState } from "react";
import GlobalTemplateStudio from "@/components/global-template-studio";
import TemplateImplementationWizard from "@/components/template-implementation-wizard";

export default function TemplateStudioPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen">
      <GlobalTemplateStudio />
      
      {selectedTemplateId && (
        <TemplateImplementationWizard 
          templateId={selectedTemplateId} 
          onClose={() => setSelectedTemplateId(null)} 
        />
      )}
    </div>
  );
}