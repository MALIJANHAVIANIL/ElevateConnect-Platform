import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';

const StudentDashboard = () => {
    const [drives, setDrives] = useState([]);
    const [applications, setApplications] = useState([]);
    const [feedback, setFeedback] = useState([]); // For Growth Loop

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const drivesRes = await api.get('/student/eligible-drives');
            setDrives(drivesRes.data);

            const appsRes = await api.get('/student/my-applications');
            setApplications(appsRes.data);

            const feedbackRes = await api.get('/student/my-feedback');
            setFeedback(feedbackRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApply = async (driveId) => {
        try {
            await api.post(`/student/apply/${driveId}`);
            alert('Applied successfully!');
            fetchData();
        } catch (err) {
            alert('Failed to apply: ' + err.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Student Dashboard</h1>

            {/* Eligible Drives Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" /> Eligible Drives
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drives.map(drive => (
                        <div key={drive.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <h3 className="text-xl font-bold text-gray-900">{drive.companyName}</h3>
                            <p className="text-gray-500 text-sm mb-4">Min CGPA: {drive.minCgpa}</p>
                            <button
                                onClick={() => handleApply(drive.id)}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                    {drives.length === 0 && <p className="text-gray-500">No active eligible drives found.</p>}
                </div>
            </section>

            {/* Applications Status & Growth Loop Section */}
            <section className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-500" /> My Applications
                    </h2>
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold">{app.drive.companyName}</h4>
                                    <p className="text-sm text-gray-500">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                  ${app.status === 'SELECTED' ? 'bg-green-100 text-green-700' :
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {app.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-red-500" /> Improvement Zone (Growth Loop)
                    </h2>
                    <div className="space-y-4">
                        {feedback.map(fb => (
                            <div key={fb.id} className="bg-red-50 p-4 rounded-lg border border-red-100">
                                <p className="text-sm text-gray-800 mb-2"><strong>Feedback:</strong> {fb.content}</p>
                                {fb.courseLink && (
                                    <div className="mb-3">
                                        <a href={fb.courseLink} target="_blank" className="text-blue-600 underline text-sm">Recommended Course</a>
                                    </div>
                                )}
                                <button className="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                                    Upload Certificate Proof
                                </button>
                            </div>
                        ))}
                        {feedback.length === 0 && <p className="text-gray-400 italic">No feedback actions required. Keep it up!</p>}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
