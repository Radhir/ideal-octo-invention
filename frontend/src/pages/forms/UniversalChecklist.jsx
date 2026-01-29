import React from 'react';
import { Printer, CheckSquare } from 'lucide-react';
import './UniversalChecklist.css';

const UniversalChecklist = ({
    title = "Detailing Check List Form",
    sections = [],
    jobCardData
}) => {
    const defaultSections = [
        {
            name: "Exterior - Silver Package",
            items: [
                "Washing with high-quality shampoo", "Clay bar embedded contaminants removal",
                "6 step Compound Body Polish", "Swirl Marks Removal", "Sealant and synthetic wax",
                "Engine bay Degreasing", "Headlight Restoring", "Wheel Rim & Calipers cleaning"
            ]
        },
        {
            name: "Interior - Silver Package",
            items: [
                "Internal Vacuuming & Deep cleaning", "Seats cleaning (stain removal)",
                "Leather Seat & Belt cleaning", "Dashboard & Console cleaning",
                "Roof & Trunk-Bay Cleaning", "AC vents & Glass Surface"
            ]
        }
    ];

    const displaySections = sections.length > 0 ? sections : defaultSections;

    return (
        <div className="checklist-container">
            <div className="print-controls no-print">
                <button onClick={() => window.print()} className="print-btn">
                    <Printer size={16} /> Print Checklist
                </button>
            </div>

            <div className="checklist-document">
                {/* Header */}
                <div className="checklist-header">
                    <h1>Elite SHINE</h1>
                    <h2>{title}</h2>
                </div>

                {/* Common Details Form */}
                <div className="common-details">
                    <div className="detail-field">
                        <label>Customer Name</label>
                        <input type="text" defaultValue={jobCardData?.customer_name || ""} />
                    </div>
                    <div className="detail-field">
                        <label>Job Card #</label>
                        <input type="text" defaultValue={jobCardData?.job_card_number || ""} />
                    </div>
                    <div className="detail-field">
                        <label>Vehicle Model</label>
                        <input type="text" defaultValue={jobCardData ? `${jobCardData.brand} ${jobCardData.model}` : ""} />
                    </div>
                    <div className="detail-field">
                        <label>Advisor / Checked By</label>
                        <input type="text" defaultValue={jobCardData?.service_advisor || ""} />
                    </div>
                </div>

                {/* Dynamic Sections Loop */}
                <div className="checklist-sections">
                    {displaySections.map((section, sIdx) => (
                        <div key={sIdx} className="checklist-section">
                            <div className="section-title">
                                <CheckSquare size={16} /> {section.name}
                            </div>
                            <div className="section-items">
                                {section.items.map((item, iIdx) => (
                                    <div key={iIdx} className="checklist-item">
                                        <span className="item-text">{item}</span>
                                        <div className="item-checkboxes">
                                            <label className="checkbox-label yes">
                                                <input type="checkbox" /> Yes
                                            </label>
                                            <label className="checkbox-label no">
                                                <input type="checkbox" /> No
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Signature */}
                <div className="signature-footer">
                    <div className="signature-box">
                        <div className="signature-line"></div>
                        <p>Technician / Advisor Signature</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Pre-configured checklist data exports
export const DETAILING_CHECKLIST = [
    {
        name: "Exterior - Silver Package",
        items: [
            "Washing with high-quality shampoo", "Clay bar embedded contaminants removal",
            "6 step Compound Body Polish", "Swirl Marks Removal", "Sealant and synthetic wax",
            "Engine bay Degreasing", "Headlight Restoring", "Wheel Rim & Calipers cleaning"
        ]
    },
    {
        name: "Interior - Silver Package",
        items: [
            "Internal Vacuuming & Deep cleaning", "Seats cleaning (stain removal)",
            "Leather Seat & Belt cleaning", "Dashboard & Console cleaning",
            "Roof & Trunk-Bay Cleaning", "AC vents & Glass Surface"
        ]
    }
];

export const ADVISOR_CHECKLIST = [
    {
        name: "Interior Inspection",
        items: [
            "Dashboard Condition", "Steering Wheel Buttons", "AC/Heater Functionality",
            "Warning Signs on Dashboard", "Power Windows", "Sunroof Operation", "Floor Mats Condition"
        ]
    },
    {
        name: "Exterior / Engine",
        items: [
            "Engine Bay Cleanliness", "Spare Wheel Present", "Jack & Tools Available",
            "Paint Scratches (Note in Remarks)"
        ]
    }
];

export default UniversalChecklist;
