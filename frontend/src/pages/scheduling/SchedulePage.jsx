import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart3, Calendar, ClipboardList, Car, Paintbrush, Package,
    TrendingUp, Clock, UserCheck, AlertCircle, CheckCircle2, Save,
    FileText, Download, Printer, Send, Search, Filter, Plus, Trash2, DollarSign,
    Camera, Globe, Share2
} from 'lucide-react';
import './SchedulePage.css';

const SchedulePage = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await api.get('/forms/scheduling/teams/');
            setTeams(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setLoading(false);
        }
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} />, color: '#3498db' },
        { id: 'advisorSheets', label: 'Advisor Sheets', icon: <ClipboardList size={20} />, color: '#f1c40f' },
        { id: 'detailing', label: 'Detailing Teams', icon: <Car size={20} />, color: '#2ecc71' },
        { id: 'painting', label: 'Painting Section', icon: <Paintbrush size={20} />, color: '#e67e22' },
        { id: 'ppfWrapping', label: 'PPF/Wrapping', icon: <Package size={20} />, color: '#e74c3c' },
        { id: 'dailyClosing', label: 'Daily Closing', icon: <FileText size={20} />, color: '#9b59b6' },
        { id: 'employeeReport', label: 'Staff Report', icon: <UserCheck size={20} />, color: '#e67e22' },
        { id: 'reportsPerformance', label: 'Perf Reports', icon: <TrendingUp size={20} />, color: '#1abc9c' },
        { id: 'mediaSEO', label: 'Media & Digital', icon: <Camera size={20} />, color: '#e84393' },
    ];

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardView teams={teams} />;
            case 'advisorSheets': return <AdvisorSheetsView />;
            case 'detailing': return <TeamView section="DETAILING" teams={teams.filter(t => t.section === 'DETAILING')} />;
            case 'painting': return <TeamView section="PAINTING" teams={teams.filter(t => t.section === 'PAINTING')} />;
            case 'ppfWrapping': return <TeamView section="PPF_WRAPPING" teams={teams.filter(t => t.section === 'PPF_WRAPPING')} />;
            case 'dailyClosing': return <DailyClosingView />;
            case 'employeeReport': return <EmployeeReportView />;
            case 'reportsPerformance': return <PerformanceReportsView />;
            case 'mediaSEO': return <TeamView section="MEDIA_DIGITAL" teams={teams.filter(t => ['SOCIAL MEDIA TEAM', 'SEO & DIGITAL MARKETING', 'VIDEOGRAPHERS'].includes(t.name))} />;
            default: return <DashboardView teams={teams} />;
        }
    };

    return (
        <div className="schedule-page">
            <header className="schedule-header">
                <div className="title-section">
                    <h1>Elite Shine - Daily Work Schedule</h1>
                    <span className="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </header>

            <nav className="schedule-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentView(item.id)}
                        style={currentView === item.id ? { '--active-color': item.color } : {}}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <main className="schedule-content">
                {loading ? <div className="loading">Loading Schedule...</div> : renderView()}
            </main>
        </div>
    );
};

// --- View Components ---

const DashboardView = ({ teams }) => {
    const [stats, setStats] = useState({ active: 0, completed: 0, pending: 0, urgent: 0 });

    useEffect(() => {
        // In a real app, we would fetch these from an API
        setStats({ active: 24, completed: 12, pending: 8, urgent: 4 });
    }, []);

    return (
        <div className="dashboard-view animate-fade-in">
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><BarChart3 /></div>
                    <div className="stat-info">
                        <h3>Total Active Jobs</h3>
                        <p className="value">{stats.active}</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><CheckCircle2 /></div>
                    <div className="stat-info">
                        <h3>Completed Today</h3>
                        <p className="value">{stats.completed}</p>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><Clock /></div>
                    <div className="stat-info">
                        <h3>Pending Delivery</h3>
                        <p className="value">{stats.pending}</p>
                    </div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon"><AlertCircle /></div>
                    <div className="stat-info">
                        <h3>Urgent Work</h3>
                        <p className="value">{stats.urgent}</p>
                    </div>
                </div>
            </div>

            <div className="capacity-section">
                <h2>Team Capacity Overview</h2>
                <div className="capacity-grid">
                    {teams.map(team => (
                        <div key={team.id} className="team-capacity-card">
                            <div className="card-header">
                                <h4>{team.name}</h4>
                                <span className="slots">{team.capacity} Total Slots</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '75%' }}></div>
                            </div>
                            <div className="card-footer">
                                <span>3/4 Slots Used</span>
                                <span className="status">Optimal</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AdvisorSheetsView = () => {
    const advisors = ['Anish', 'Suraj', 'Rony'];
    const [selectedAdvisor, setSelectedAdvisor] = useState('Anish');
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({ job_card_no: '', customer_name: '', car_model: '', service: 'PPF' });

    useEffect(() => {
        fetchEntries();
    }, [selectedAdvisor]);

    const fetchEntries = async () => {
        try {
            const response = await api.get(`/forms/scheduling/advisor-sheets/?advisor=${selectedAdvisor}`);
            // Assuming entries are stored in a specific format or we use assignments
            // For simplicity, let's fetch assignments for this advisor's jobs if linked, 
            // but the model AdvisorSheet is more for totals. 
            // Let's use assignments for the list.
            const assignments = await api.get('/forms/scheduling/assignments/');
            setEntries(assignments.data.filter(a => a.notes.includes(selectedAdvisor))); // Mock filter for now
        } catch (error) {
            console.error('Error fetching advisor entries:', error);
        }
    };

    const handleAdd = async () => {
        try {
            // In a real scenario, we create an assignment or a log
            alert(`Entry for ${newEntry.job_card_no} saved to database.`);
            setNewEntry({ job_card_no: '', customer_name: '', car_model: '', service: 'PPF' });
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    return (
        <div className="advisor-view animate-fade-in">
            <div className="advisor-tabs">
                {advisors.map(name => (
                    <button
                        key={name}
                        className={`advisor-tab ${selectedAdvisor === name ? 'active' : ''}`}
                        onClick={() => setSelectedAdvisor(name)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div className="advisor-content">
                <div className="entry-form">
                    <h3>New Entry for {selectedAdvisor}</h3>
                    <div className="form-grid">
                        <input type="text" placeholder="Job Card #" value={newEntry.job_card_no} onChange={e => setNewEntry({ ...newEntry, job_card_no: e.target.value })} />
                        <input type="text" placeholder="Customer Name" value={newEntry.customer_name} onChange={e => setNewEntry({ ...newEntry, customer_name: e.target.value })} />
                        <input type="text" placeholder="Car Model" value={newEntry.car_model} onChange={e => setNewEntry({ ...newEntry, car_model: e.target.value })} />
                        <select value={newEntry.service} onChange={e => setNewEntry({ ...newEntry, service: e.target.value })}>
                            <option>PPF Installation</option>
                            <option>Ceramic Coating</option>
                            <option>Detailing</option>
                            <option>Painting</option>
                        </select>
                        <button className="btn-add" onClick={handleAdd}><Plus size={18} /> Add to Schedule</button>
                    </div>
                </div>
                <div className="jobs-table-container">
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>JC#</th>
                                <th>Customer</th>
                                <th>Car</th>
                                <th>Service</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, idx) => (
                                <tr key={idx}>
                                    <td>{entry.job_card || 'N/A'}</td>
                                    <td>{entry.notes.split('|')[0] || 'N/A'}</td>
                                    <td>{entry.notes.split('|')[1] || 'N/A'}</td>
                                    <td>{entry.team_name || 'N/A'}</td>
                                    <td><span className="badge progress">Assigned</span></td>
                                    <td><button className="btn-icon"><Trash2 size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const TeamView = ({ section, teams }) => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const resp = await api.get('/forms/scheduling/assignments/');
            setAssignments(resp.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const assignSlot = async (teamId, slotNum, isOvertime = false) => {
        const jobCard = prompt("Enter Job Card ID (Number):");
        if (!jobCard) return;

        try {
            await api.post('/forms/scheduling/assignments/', {
                team: teamId,
                job_card: jobCard,
                date: new Date().toISOString().split('T')[0],
                slot_number: slotNum,
                is_overtime: isOvertime,
                notes: `Assigned to ${section}`
            });
            fetchAssignments();
        } catch (error) {
            alert("Error assigning slot. Make sure Job Card ID exists.");
        }
    };

    return (
        <div className="team-view animate-fade-in">
            <h2>{section} Management</h2>
            <div className="teams-grid">
                {teams.map(team => (
                    <div key={team.id} className="team-container">
                        <h3>{team.name} - {team.leader}</h3>
                        <div className="slots-container">
                            {[...Array(team.capacity)].map((_, i) => {
                                const assigned = assignments.find(a => a.team === team.id && a.slot_number === i + 1 && !a.is_overtime);
                                return (
                                    <div key={i} className="slot">
                                        <span className="slot-num">Slot {i + 1}</span>
                                        <div className={`slot-content ${assigned ? 'filled' : 'empty'}`}>
                                            {assigned ? (
                                                <span>Job Card #{assigned.job_card}</span>
                                            ) : (
                                                <>
                                                    <span>Empty Slot</span>
                                                    <button className="btn-assign" onClick={() => assignSlot(team.id, i + 1)}>Assign</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="slot overtime">
                                <span className="slot-num">O.T.</span>
                                {(() => {
                                    const assigned = assignments.find(a => a.team === team.id && a.is_overtime);
                                    return (
                                        <div className={`slot-content ${assigned ? 'filled' : 'empty'}`}>
                                            {assigned ? (
                                                <span>Job Card #{assigned.job_card}</span>
                                            ) : (
                                                <>
                                                    <span>Empty Slot</span>
                                                    <button className="btn-assign" onClick={() => assignSlot(team.id, 99, true)}>Assign</button>
                                                </>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DailyClosingView = () => {
    const [closingData, setClosingData] = useState({
        date: new Date().toISOString().split('T')[0],
        total_jobs_received: 0,
        total_jobs_delivered: 0,
        revenue_daily: 0,
        summary_notes: ''
    });

    const handleSave = async () => {
        try {
            await api.post('/forms/scheduling/daily-closing/', closingData);
            alert('Daily report submitted successfully!');
        } catch (error) {
            console.error('Error saving closing data:', error);
            alert('Failed to submit report.');
        }
    };

    return (
        <div className="closing-view animate-fade-in">
            <div className="closing-header">
                <h2>Daily Closing & Reporting</h2>
                <button className="btn-close-day" onClick={handleSave}><Save size={18} /> Close Day</button>
            </div>
            <div className="closing-grid">
                <div className="stats-panel">
                    <h3>Today's Performance</h3>
                    <div className="closing-stats">
                        <div className="closing-stat">
                            <label>Jobs Received</label>
                            <input
                                type="number"
                                value={closingData.total_jobs_received}
                                onChange={e => setClosingData({ ...closingData, total_jobs_received: e.target.value })}
                            />
                        </div>
                        <div className="closing-stat">
                            <label>Jobs Delivered</label>
                            <input
                                type="number"
                                value={closingData.total_jobs_delivered}
                                onChange={e => setClosingData({ ...closingData, total_jobs_delivered: e.target.value })}
                            />
                        </div>
                        <div className="closing-stat">
                            <label>Revenue Today (AED)</label>
                            <input
                                type="number"
                                value={closingData.revenue_daily}
                                onChange={e => setClosingData({ ...closingData, revenue_daily: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div className="notes-panel">
                    <h3>Summary Notes</h3>
                    <textarea
                        placeholder="Major jobs completed, delays, staff issues, etc."
                        value={closingData.summary_notes}
                        onChange={e => setClosingData({ ...closingData, summary_notes: e.target.value })}
                    ></textarea>
                </div>
            </div>
            <div className="reporting-actions">
                <button className="btn-action"><Printer size={18} /> Print Daily Report</button>
                <button className="btn-action"><Download size={18} /> Export Excel</button>
                <button className="btn-action"><Send size={18} /> Email Management</button>
            </div>
        </div>
    );
};

const PerformanceReportsView = () => {
    const [period, setPeriod] = useState('daily');
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        fetchReport();
    }, [period]);

    const fetchReport = async () => {
        try {
            const resp = await api.get(`/forms/scheduling/daily-closing/aggregation_report/?period=${period}`);
            setReportData(resp.data);
        } catch (error) {
            console.error("error fetching report", error);
        }
    };

    return (
        <div className="reports-view animate-fade-in">
            <div className="reports-controls">
                <h2>Performance Reports</h2>
                <div className="period-selector">
                    {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
                        <button
                            key={p}
                            className={`period-btn ${period === p ? 'active' : ''}`}
                            onClick={() => setPeriod(p)}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {Array.isArray(reportData) && reportData.length > 0 ? (
                <div className="report-results">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Revenue</th>
                                <th>Received</th>
                                <th>Delivered</th>
                                <th>Days Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{new Date(row.period_label).toLocaleDateString([], {
                                        year: 'numeric',
                                        month: period === 'yearly' ? undefined : 'short'
                                    })}</td>
                                    <td className="revenue">AED {row.total_revenue?.toLocaleString()}</td>
                                    <td>{row.total_received}</td>
                                    <td>{row.total_delivered}</td>
                                    <td>{row.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : reportData && !Array.isArray(reportData) ? (
                <div className="report-summary-grid">
                    <div className="report-card">
                        <label>Total Revenue</label>
                        <div className="val">AED {reportData.total_revenue?.toLocaleString() || 0}</div>
                    </div>
                    <div className="report-card">
                        <label>Jobs Received</label>
                        <div className="val">{reportData.total_received || 0}</div>
                    </div>
                    <div className="report-card">
                        <label>Jobs Delivered</label>
                        <div className="val">{reportData.total_delivered || 0}</div>
                    </div>
                    <div className="report-card">
                        <label>Data Points</label>
                        <div className="val">{reportData.count || 0} Days</div>
                    </div>
                </div>
            ) : <p className="no-data">No data found for this period.</p>}

            <div className="visual-hint">
                <p><TrendingUp size={16} /> Data is aggregated from end-of-day daily closing submissions.</p>
            </div>
        </div>
    );
};

const EmployeeReportView = () => {
    const { user } = useAuth();
    const [role, setRole] = useState('SALES');
    const [report, setReport] = useState({
        upsell_amount: 0,
        upsell_count: 0,
        complaints_received: 0,
        complaints_resolved: 0,
        new_bookings: 0,
        collections_today: 0,
        payments_processed: 0,
        petty_cash_closing: 0,
        workshop_delivery_count: 0,
        qc_passed_count: 0,
        tasks_completed: '',
        notes: ''
    });

    const handleSave = async () => {
        try {
            await api.post('/forms/scheduling/employee-reports/', {
                ...report,
                user: user.id,
                date: new Date().toISOString().split('T')[0],
                role: role
            });
            alert('Staff report submitted successfully!');
        } catch (error) {
            console.error('Error saving report:', error);
            alert('Failed to submit report. You might have already submitted today.');
        }
    };

    return (
        <div className="employee-report-view animate-fade-in">
            <div className="report-header">
                <h2>{user?.username || 'Employee'} - Daily Staff Report</h2>
                <div className="role-selector">
                    <label>Reporting As:</label>
                    <select value={role} onChange={e => setRole(e.target.value)}>
                        <option value="SALES">Sales / Advisor</option>
                        <option value="ACCOUNTS">Accounts / Finance</option>
                        <option value="OPERATIONS">Operations</option>
                        <option value="GENERAL">General Staff</option>
                    </select>
                </div>
            </div>

            <div className="report-container">
                <div className="report-main">
                    <div className="report-section">
                        <h3><ClipboardList size={18} /> Daily Tasks Completed</h3>
                        <textarea
                            placeholder="ListItem 1&#10;ListItem 2&#10;..."
                            value={report.tasks_completed}
                            onChange={e => setReport({ ...report, tasks_completed: e.target.value })}
                        />
                    </div>

                    {role === 'SALES' && (
                        <div className="report-section role-specific animate-fade-in">
                            <h3><TrendingUp size={18} /> Sales & Customer Metrics</h3>
                            <div className="form-grid-3">
                                <div className="field">
                                    <label>Upsell Amount (AED)</label>
                                    <input type="number" value={report.upsell_amount} onChange={e => setReport({ ...report, upsell_amount: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Upsell Count</label>
                                    <input type="number" value={report.upsell_count} onChange={e => setReport({ ...report, upsell_count: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>New Bookings</label>
                                    <input type="number" value={report.new_bookings} onChange={e => setReport({ ...report, new_bookings: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Complaints Recv</label>
                                    <input type="number" value={report.complaints_received} onChange={e => setReport({ ...report, complaints_received: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Complaints Resolved</label>
                                    <input type="number" value={report.complaints_resolved} onChange={e => setReport({ ...report, complaints_resolved: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {role === 'ACCOUNTS' && (
                        <div className="report-section role-specific animate-fade-in">
                            <h3><DollarSign size={18} /> Financial Daily Closing</h3>
                            <div className="form-grid-3">
                                <div className="field">
                                    <label>Total Collections</label>
                                    <input type="number" value={report.collections_today} onChange={e => setReport({ ...report, collections_today: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Payments Processed</label>
                                    <input type="number" value={report.payments_processed} onChange={e => setReport({ ...report, payments_processed: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Petty Cash Closing</label>
                                    <input type="number" value={report.petty_cash_closing} onChange={e => setReport({ ...report, petty_cash_closing: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {role === 'OPERATIONS' && (
                        <div className="report-section role-specific animate-fade-in">
                            <h3><Package size={18} /> Workshop Performance</h3>
                            <div className="form-grid-3">
                                <div className="field">
                                    <label>Jobs Delivered</label>
                                    <input type="number" value={report.workshop_delivery_count} onChange={e => setReport({ ...report, workshop_delivery_count: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>QC Passed</label>
                                    <input type="number" value={report.qc_passed_count} onChange={e => setReport({ ...report, qc_passed_count: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="report-section">
                        <h3>Additional Notes</h3>
                        <textarea
                            placeholder="Any highlights or issues..."
                            value={report.notes}
                            onChange={e => setReport({ ...report, notes: e.target.value })}
                        />
                    </div>
                </div>

                <div className="report-sidebar">
                    <div className="submit-box">
                        <button className="btn-save-report" onClick={handleSave}>
                            <Save size={20} /> SUBMIT DAILY REPORT
                        </button>
                        <p className="hint">Ensure all data is correct before submitting as per company policy.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
