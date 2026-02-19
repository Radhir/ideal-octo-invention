import React, { useState, useEffect, useRef } from 'react';
import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioGrid, PortfolioDetailBox
} from '../../components/PortfolioComponents';
import {
    User, IdCard, Printer, Share2,
    Upload, Search, Mail, Smartphone,
    Globe, ShieldAlert, ChevronRight
} from 'lucide-react';
import api from '../../api/axios';

const IDCardGenerator = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cardData, setCardData] = useState({
        fullName: '',
        role: '',
        department: '',
        pin: '',
        nationality: '',
        passportNo: '',
        passportExpiry: '',
        visaNo: '',
        visaExpiry: '',
        healthIssues: 'None',
        emergencyContact: '',
        photo: null
    });

    const cardRef = useRef(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/hr/api/employees/');
            setEmployees(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching employees', err);
            setLoading(false);
        }
    };

    const handleEmployeeSelect = (emp) => {
        setSelectedEmployee(emp);
        setCardData({
            fullName: emp.full_name || emp.full_name_passport || '',
            role: emp.role || '',
            department: emp.department_name || '',
            pin: emp.pin_code || '',
            nationality: emp.nationality || '',
            passportNo: emp.passport_no || '',
            passportExpiry: emp.passport_expiry || '',
            visaNo: emp.visa_uid || '',
            visaExpiry: emp.visa_expiry || '',
            healthIssues: emp.medical_history || 'None',
            emergencyContact: `${emp.uae_emer_name || ''} ${emp.uae_emer_phone || ''}`.trim(),
            photo: emp.profile_image || null
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        `Name: ${cardData.fullName}\nID: ${selectedEmployee?.employee_id || ''}\nPIN: ${cardData.pin}`
    )}`;

    if (loading) return <PortfolioPage>Loading Intelligence Registry...</PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="HR / ID Card Generator">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Industrial-grade credentialing and asset identification system.">
                    ID COMMAND CENTER
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={handlePrint} variant="gold">
                        <Printer size={18} style={{ marginRight: '10px' }} /> PRINT CREDENTIALS
                    </PortfolioButton>
                    <PortfolioButton variant="secondary">
                        <Share2 size={18} style={{ marginRight: '10px' }} /> SHARE ACCESS
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioGrid columns="1fr 2fr">
                {/* Employee Selector */}
                <div style={glassCardStyle}>
                    <h3 style={sectionTitleStyle}>PERSONNEL REGISTRY</h3>
                    <div style={searchContainerStyle}>
                        <Search size={16} color="rgba(232, 230, 227, 0.4)" />
                        <input
                            type="text"
                            placeholder="Search operatives..."
                            style={searchInputStyle}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={employeeListStyle}>
                        {employees.filter(emp =>
                            emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            emp.employee_id?.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(emp => (
                            <div
                                key={emp.id}
                                style={selectedEmployee?.id === emp.id ? activeEmployeeItemStyle : employeeItemStyle}
                                onClick={() => handleEmployeeSelect(emp)}
                            >
                                <div style={empAvatarStyle(emp.profile_image)} />
                                <div style={{ flex: 1 }}>
                                    <div style={empNameStyle}>{emp.full_name}</div>
                                    <div style={empIdStyle}>{emp.employee_id} • {emp.role}</div>
                                </div>
                                <ChevronRight size={14} color="rgba(232, 230, 227, 0.2)" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ID Card Display & Data */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', background: 'rgba(0,0,0,0.2)', borderRadius: '30px', border: '1px solid rgba(232, 230, 227, 0.05)' }}>
                        {/* THE ID CARD */}
                        <div style={idCardStyle} id="idCardPrint">
                            <div style={cardHeaderStyle}>
                                <div style={{ fontSize: '12px', fontWeight: '900', color: '#b08d57', letterSpacing: '2px' }}>ELITE SHINE GROUP</div>
                                <div style={{ fontSize: '8px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '2px' }}>OFFICIAL OPERATIVE CREDENTIAL</div>
                            </div>

                            <div style={photoContainerStyle}>
                                <div style={photoCircleStyle(cardData.photo)} />
                            </div>

                            <div style={cardBodyStyle}>
                                <div style={cardNameStyle}>{cardData.fullName || 'SELECT OPERATIVE'}</div>
                                <div style={cardRoleStyle}>{cardData.role || 'ROLE'} | {cardData.department || 'DEPT'}</div>

                                <div style={pinBoxStyle}>
                                    <span style={{ fontSize: '9px', opacity: 0.5 }}>SECURE PIN</span>
                                    <span style={{ fontSize: '16px', fontWeight: '900', color: '#b08d57', letterSpacing: '4px' }}>{cardData.pin || '------'}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                                    <img src={qrUrl} alt="QR Access" style={{ width: '100px', height: '100px', borderRadius: '10px', padding: '5px', background: '#fff' }} />
                                </div>

                                <div style={cardGridStyle}>
                                    <div style={cardDetailStyle}>
                                        <span style={detailLabelStyle}>PASSPORT</span>
                                        <span style={detailValueStyle}>{cardData.passportNo || '---'}</span>
                                    </div>
                                    <div style={cardDetailStyle}>
                                        <span style={detailLabelStyle}>EXPIRY</span>
                                        <span style={detailValueStyle}>{cardData.passportExpiry || '---'}</span>
                                    </div>
                                    <div style={cardDetailStyle}>
                                        <span style={detailLabelStyle}>VISA UID</span>
                                        <span style={detailValueStyle}>{cardData.visaNo || '---'}</span>
                                    </div>
                                    <div style={cardDetailStyle}>
                                        <span style={detailLabelStyle}>EXPIRY</span>
                                        <span style={detailValueStyle}>{cardData.visaExpiry || '---'}</span>
                                    </div>
                                    <div style={{ ...cardDetailStyle, gridColumn: 'span 2' }}>
                                        <span style={detailLabelStyle}>NATIONALITY</span>
                                        <span style={detailValueStyle}>{cardData.nationality || '---'}</span>
                                    </div>
                                </div>

                                <div style={healthAlertStyle}>
                                    <ShieldAlert size={12} color="#f87171" style={{ marginRight: '8px' }} />
                                    HEALTH: {cardData.healthIssues}
                                </div>

                                <div style={{ marginTop: '15px', fontSize: '10px', color: 'rgba(232, 230, 227, 0.4)', textAlign: 'center' }}>
                                    EMERGENCY: {cardData.emergencyContact || 'NOT REGISTERED'}
                                </div>
                            </div>

                            <div style={cardFooterStyle}>
                                AUTHENTICATED ACCESS SYSTEM • 2026
                            </div>
                        </div>
                    </div>

                    <div style={glassCardStyle}>
                        <h3 style={sectionTitleStyle}>IDENTIFICATION METADATA</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <PortfolioDetailBox label="FULL LEGAL NAME">{cardData.fullName}</PortfolioDetailBox>
                            <PortfolioDetailBox label="DEPARTMENTAL ASSIGNMENT">{cardData.department}</PortfolioDetailBox>
                            <PortfolioDetailBox label="PASSPORT CRYPTOGRAPHY">{cardData.passportNo} (Exp: {cardData.passportExpiry})</PortfolioDetailBox>
                            <PortfolioDetailBox label="RESIDENCY VALIDATION">{cardData.visaNo} (Exp: {cardData.visaExpiry})</PortfolioDetailBox>
                        </div>
                    </div>
                </div>
            </PortfolioGrid>

        </PortfolioPage>
    );
};

// Styles
const glassCardStyle = {
    padding: '30px',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '24px',
    height: 'fit-content'
};

const sectionTitleStyle = {
    fontSize: '11px',
    fontWeight: '900',
    color: '#b08d57',
    letterSpacing: '2px',
    marginBottom: '25px',
    textTransform: 'uppercase'
};

const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(232, 230, 227, 0.05)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '12px',
    padding: '0 15px',
    height: '42px',
    marginBottom: '20px'
};

const searchInputStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    width: '100%'
};

const employeeListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '500px',
    overflowY: 'auto',
    paddingRight: '10px'
};

const employeeItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid transparent'
};

const activeEmployeeItemStyle = {
    ...employeeItemStyle,
    background: 'rgba(176, 141, 87, 0.1)',
    border: '1px solid rgba(176, 141, 87, 0.3)'
};

const empAvatarStyle = (img) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: img ? `url(${img}) center/cover` : 'rgba(232, 230, 227, 0.1)',
    border: '1px solid rgba(232, 230, 227, 0.2)'
});

const empNameStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--cream)'
};

const empIdStyle = {
    fontSize: '10px',
    color: 'rgba(232, 230, 227, 0.4)',
    fontWeight: '600'
};

// ID CARD VISUAL STYLES
const idCardStyle = {
    width: '350px',
    background: '#1a1a1a',
    borderRadius: '25px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    position: 'relative',
    color: 'var(--cream)'
};

const cardHeaderStyle = {
    padding: '30px 20px 60px 20px',
    background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
    textAlign: 'center',
    borderBottom: '1px solid rgba(176, 141, 87, 0.2)'
};

const photoContainerStyle = {
    position: 'absolute',
    top: '75px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2
};

const photoCircleStyle = (img) => ({
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    background: img ? `url(${img}) center/cover` : '#222',
    border: '5px solid #1a1a1a',
    boxShadow: '0 10px 20px rgba(0,0,0,0.4)'
});

const cardBodyStyle = {
    padding: '65px 30px 30px 30px',
    textAlign: 'center'
};

const cardNameStyle = {
    fontSize: '22px',
    fontWeight: '900',
    color: 'var(--cream)',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
};

const cardRoleStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#b08d57',
    marginBottom: '20px'
};

const pinBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    background: 'rgba(0,0,0,0.3)',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid rgba(232, 230, 227, 0.05)'
};

const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '20px',
    textAlign: 'left'
};

const cardDetailStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
};

const detailLabelStyle = {
    fontSize: '8px',
    fontWeight: '900',
    color: 'rgba(232, 230, 227, 0.3)',
    letterSpacing: '1px'
};

const detailValueStyle = {
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(232, 230, 227, 0.8)'
};

const healthAlertStyle = {
    marginTop: '20px',
    padding: '10px',
    background: 'rgba(248, 113, 113, 0.05)',
    border: '1px solid rgba(248, 113, 113, 0.1)',
    borderRadius: '10px',
    fontSize: '9px',
    fontWeight: '900',
    color: '#f87171',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const cardFooterStyle = {
    padding: '15px',
    background: '#111',
    fontSize: '8px',
    fontWeight: '900',
    opacity: 0.3,
    textAlign: 'center',
    letterSpacing: '2px'
};

export default IDCardGenerator;
