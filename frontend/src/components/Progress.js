import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "../css/Common.css"


const steps = [
    {
        label: 'Upload Class List',
        description: `Upload a class list in JSON File.`,
    },
    {
        label: 'Upload Rubric',
        description: 'Upload a rubric in JSON File.',
    },
    {
        label: 'Start Marking',
        description: `Marking the students' work.`,
    },
    {
        label: 'Ready to Download',
        description: `Download mark results.`,
    }
];

export default function ProgressBar({ activeStep, setActiveStep, handleBack}) {

    return (
        <Box>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length-1 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}