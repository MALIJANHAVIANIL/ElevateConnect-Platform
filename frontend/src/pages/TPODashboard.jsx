import { useEffect, useState } from 'react';
import api from '../api/axios';
import { PlusCircle, Users, BarChart } from 'lucide-react';

const TPODashboard = () => {
    const [drives, setDrives] = useState([]);
    const [showDriveForm, setShowDriveForm] = useState(false);
    const [newDrive, setNewDrive] = useState({ companyName: '', jobDescription: '', minCgpa: 0, deadline: '' });

    // Application Management State
    const [selectedDriveId, setSelectedDriveId] = useState(null);
    const [applications, setApplications] = useState([]);

    // Feedback Modal State
    const [rejectingAppId, setRejectingAppId] = useState(null);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [courseLink, setCourseLink] = useState('');

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        const res = await api.get('/tpo/drives');
        setDrives(res.data);
    };

    const handlePostDrive = async (e) => {
        e.preventDefault();
        await api.post('/tpo/drives', newDrive);
        setShowDriveForm(false);
        fetchDrives();
    };

    const viewApplications = async (driveId) => {
        setSelectedDriveId(driveId);
        const res = await api.get(`/tpo/drives/${driveId}/applications`);
        setApplications(res.data);
    };

    const updateStatus = async (appId, status) => {
        if (status === 'REJECTED') {
            setRejectingAppId(appId);
            return;
        }
        await api.put(`/tpo/applications/${appId}/status?status=${status}`);
        viewApplications(selectedDriveId);
    };

    const submitRejection = async () => {
        // 1. Update status to REJECTED
        await api.put(`/tpo/applications/${rejectingAppId}/status?status=REJECTED`);

        // 2. Submit Feedback (Growth Loop Trigger)
        // We need student ID from the application list
        const app = applications.find(a => a.id === rejectingAppId);
        if (app) {
            await api.post('/tpo/feedback', {
                student: { id: app.student.id },
                content: feedbackContent,
                courseLink: courseLink
            });
        }

        setRejectingAppId(null);
        setFeedbackContent('');
        viewApplications(selectedDriveId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">TPO Dashboard</h1>
                <button
                    onClick={() => setShowDriveForm(!showDriveForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <PlusCircle className="w-5 h-5" /> Post New Drive
                </button>
            </div>

            {showDriveForm && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 animate-fade-in">
                    <form onSubmit={handlePostDrive} className="grid grid-cols-2 gap-4">
                        <input placeholder="Company Name" className="border p-2 rounded" onChange={e => setNewDrive({ ...newDrive, companyName: e.target.value })} required />
                        <input placeholder="Min CGPA" type="number" step="0.1" className="border p-2 rounded" onChange={e => setNewDrive({ ...newDrive, minCgpa: e.target.value })} required />
                        <input placeholder="Job Description" className="border p-2 rounded col-span-2" onChange={e => setNewDrive({ ...newDrive, jobDescription: e.target.value })} required />
                        <input type="date" className="border p-2 rounded" onChange={e => setNewDrive({ ...newDrive, deadline: e.target.value })} required />
                        <button type="submit" className="bg-green-600 text-white py-2 rounded col-span-2">Launch Drive</button>
                    </form>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Drive List */}
                <div className="col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-gray-700">Active Drives</h2>
                    {drives.map(drive => (
                        <div
                            key={drive.id}
                            onClick={() => viewApplications(drive.id)}
                            className={`p-4 rounded-lg border cursor-pointer hover:bg-blue-50 transition ${selectedDriveId === drive.id ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}
                        >
                            <h3 className="font-bold">{drive.companyName}</h3>
                            <p className="text-xs text-gray-500">Status: {drive.status}</p>
                        </div>
                    ))}
                </div>

                {/* Application Management */}
                <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border h-[600px] overflow-y-auto">
                    {selectedDriveId ? (
                        <>
                            <h2 className="text-xl font-bold mb-4">Applications</h2>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-2">Student</th>
                                        <th className="pb-2">CGPA</th>
                                        <th className="pb-2">Status</th>
                                        <th className="pb-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-3">{app.student.name || app.student.email}</td>
                                            <td className="py-3">{app.student.cgpa || 'N/A'}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'APPLIED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="py-3 flex gap-2">
                                                <button onClick={() => updateStatus(app.id, 'SELECTED')} className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs hover:bg-green-200">Select</button>
                                                <button onClick={() => updateStatus(app.id, 'REJECTED')} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Select a drive to manage applications
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Feedback Modal */}
            {rejectingAppId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-md w-full">
                        <h3 className="text-lg font-bold mb-2">Reject & Assign Growth Plan</h3>
                        <p className="text-sm text-gray-500 mb-4">Provide feedback to help the student improve.</p>

                        <textarea
                            className="w-full border p-2 rounded mb-3"
                            rows="3"
                            placeholder="Reason for rejection / Areas of improvement..."
                            value={feedbackContent}
                            onChange={e => setFeedbackContent(e.target.value)}
                        />
                        <input
                            className="w-full border p-2 rounded mb-4"
                            placeholder="Recommended Course Link (Udemy/Coursera)"
                            value={courseLink}
                            onChange={e => setCourseLink(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setRejectingAppId(null)} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button onClick={submitRejection} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TPODashboard;
