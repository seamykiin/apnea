import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { generatePDF } from "@/lib/pdfGenerator";

interface ResultsDisplayProps {
  prediction: any;
}

const ResultsDisplay = ({ prediction }: ResultsDisplayProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "normal":
        return "bg-success text-success-foreground";
      case "mild":
        return "bg-warning text-warning-foreground";
      case "moderate":
        return "bg-orange-500 text-white";
      case "severe":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "normal":
        return <CheckCircle2 className="w-6 h-6" />;
      case "mild":
        return <AlertCircle className="w-6 h-6" />;
      case "moderate":
      case "severe":
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  const handleDownloadPDF = () => {
    generatePDF(prediction);
  };

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className="p-8 shadow-medium bg-gradient-subtle">
        <div className="text-center mb-6">
          {prediction.patientData?.name && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
              <h3 className="text-xl font-semibold text-foreground">{prediction.patientData.name}</h3>
            </div>
          )}
          <h2 className="text-2xl font-bold text-foreground mb-4">Prediction Results</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            {getSeverityIcon(prediction.severity)}
            <Badge className={`text-lg px-6 py-2 ${getSeverityColor(prediction.severity)}`}>
              {prediction.severity}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Confidence Score</span>
              <span className="font-semibold text-foreground">{prediction.confidence}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-2" />
          </div>
          {prediction.predictedAHI && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Predicted AHI</p>
              <p className="text-2xl font-bold text-primary">{prediction.predictedAHI.toFixed(1)}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Risk Factors */}
      <Card className="p-6 shadow-soft">
        <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-warning" />
          Key Risk Factors
        </h3>
        <ul className="space-y-2">
          {prediction.riskFactors?.map((factor: string, index: number) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-warning mt-0.5">•</span>
              <span className="text-muted-foreground">{factor}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Clinical Interpretation */}
      <Card className="p-6 shadow-soft">
        <h3 className="font-semibold text-lg mb-3 text-foreground">Clinical Interpretation</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {prediction.interpretation}
        </p>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 shadow-soft">
        <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          Recommendations
        </h3>
        <ul className="space-y-3">
          {prediction.recommendations?.map((rec: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-xs font-semibold">{index + 1}</span>
              </div>
              <span className="text-sm text-muted-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Clinical Notes */}
      {prediction.clinicalNotes && (
        <Card className="p-6 shadow-soft bg-muted/30">
          <h3 className="font-semibold text-lg mb-3 text-foreground">Clinical Notes</h3>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            {prediction.clinicalNotes}
          </p>
        </Card>
      )}

      {/* Download Button */}
      <Button onClick={handleDownloadPDF} className="w-full shadow-soft" size="lg">
        <FileDown className="mr-2 h-5 w-5" />
        Download Detailed PDF Report
      </Button>

      {/* Disclaimer */}
      <Card className="p-4 bg-warning/10 border-warning/20">
        <p className="text-xs text-center text-muted-foreground">
          <strong>Medical Disclaimer:</strong> This prediction is generated by AI and should not replace 
          professional medical diagnosis. Always consult with qualified healthcare providers for proper 
          evaluation and treatment.
        </p>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
