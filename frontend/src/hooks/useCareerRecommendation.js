import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';

/**
 * Custom hook encapsulating all state and handlers for the CareerRecommendation page.
 */
const useCareerRecommendation = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State
    const [step, setStep] = useState(1); // 1: Skills selection, 2: Results
    const [allSkills, setAllSkills] = useState({});
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [selectedForComparison, setSelectedForComparison] = useState([]);
    const [showComparisonModal, setShowComparisonModal] = useState(false);
    const [savedCareerIds, setSavedCareerIds] = useState(new Set());
    const [showBookmarkTip, setShowBookmarkTip] = useState(false);

    useEffect(() => {
        fetchSkills();
        fetchSavedCareers();
        loadUserSkills();

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'update') {
            setStep(1);
            localStorage.removeItem('career_recommendations');
        } else {
            loadPreviousRecommendations();
        }
    }, []);

    // --- API Calls & Data Loading ---
    const fetchSkills = async () => {
        try {
            setLoading(true);
            const response = await API.skills.getAll();
            setAllSkills(response.data.skills || {});
        } catch (error) {
            showToast('Failed to load skills', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadUserSkills = async () => {
        try {
            const response = await API.skills.getUserSkills();
            if (response.data.success && response.data.skills.length > 0) {
                const userSkills = response.data.skills.map(s => ({
                    skill_id: s.skill_id,
                    name: s.name,
                    category: s.category,
                    proficiency: s.proficiency
                }));
                setSelectedSkills(userSkills);
            }
        } catch (error) {
            console.log('No previous skills found');
        }
    };

    const loadPreviousRecommendations = () => {
        try {
            const saved = localStorage.getItem('career_recommendations');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.recommendations && data.recommendations.length > 0) {
                    setRecommendations(data.recommendations);
                    if (data.step === 2) {
                        setStep(2);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load previous recommendations', error);
        }
    };

    const fetchSavedCareers = async () => {
        try {
            const response = await API.careers.getSaved();
            if (response.data.success) {
                const ids = new Set(response.data.careers.map(c => c.id));
                setSavedCareerIds(ids);
            }
        } catch (error) {
            console.error('Failed to load saved careers', error);
        }
    };

    // --- Handlers ---
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleSkillToggle = (skillId, skillName, category) => {
        const existing = selectedSkills.find(s => s.skill_id === skillId);
        if (existing) {
            setSelectedSkills(selectedSkills.filter(s => s.skill_id !== skillId));
        } else {
            setSelectedSkills([...selectedSkills, {
                skill_id: skillId,
                name: skillName,
                category,
                proficiency: 'intermediate'
            }]);
        }
    };

    const handleProficiencyChange = (skillId, proficiency) => {
        setSelectedSkills(selectedSkills.map(s =>
            s.skill_id === skillId ? { ...s, proficiency } : s
        ));
    };

    const handleClearSkills = () => {
        setSelectedSkills([]);
        showToast('All skills cleared', 'success');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSkills.length === 0) {
            showToast('Please select at least one skill', 'error');
            return;
        }

        try {
            setLoading(true);
            const skillsPayload = selectedSkills.map(s => ({
                skill_id: s.skill_id,
                proficiency: s.proficiency
            }));

            await API.skills.saveUserSkills(skillsPayload);
            const response = await API.careers.getRecommendations();
            const newRecommendations = response.data.careers || [];

            setRecommendations(newRecommendations);
            setStep(2);

            localStorage.setItem('career_recommendations', JSON.stringify({
                recommendations: newRecommendations,
                step: 2,
                timestamp: new Date().toISOString()
            }));

            setShowBookmarkTip(true);
            setTimeout(() => setShowBookmarkTip(false), 5000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to generate recommendations', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCareer = async (careerId) => {
        try {
            if (savedCareerIds.has(careerId)) {
                await API.careers.unsave(careerId);
                setSavedCareerIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(careerId);
                    return newSet;
                });
                showToast('Career removed from bookmarks', 'success');
            } else {
                await API.careers.save(careerId);
                setSavedCareerIds(prev => new Set([...prev, careerId]));
                showToast('Career bookmarked successfully!', 'success');
            }
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to save career', 'error');
        }
    };

    const handleBackToRecommendations = () => {
        setStep(1);
        localStorage.setItem('career_recommendations', JSON.stringify({
            recommendations,
            step: 1,
            timestamp: new Date().toISOString()
        }));
    };

    const handleEmailReport = async (careerId) => {
        try {
            setLoading(true);
            const response = await API.careers.emailReport(careerId);
            if (response.data.success) {
                showToast('Career report sent to your email!', 'success');
            }
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to send email', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (careerId, careerTitle) => {
        try {
            setLoading(true);
            const response = await API.careers.downloadPDF(careerId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `career_report_${careerTitle.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            showToast('PDF downloaded successfully!', 'success');
        } catch (error) {
            showToast('Failed to download PDF', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleViewSkillGap = (careerId) => {
        navigate(`/skill-gap/${careerId}`);
    };

    const handleToggleComparison = (career) => {
        if (selectedForComparison.find(c => c.id === career.id)) {
            setSelectedForComparison(selectedForComparison.filter(c => c.id !== career.id));
        } else {
            if (selectedForComparison.length >= 4) {
                showToast('You can compare up to 4 careers only', 'error');
                return;
            }
            setSelectedForComparison([...selectedForComparison, career]);
        }
    };

    const handleCompare = () => {
        if (selectedForComparison.length < 2) {
            showToast('Please select at least 2 careers to compare', 'error');
            return;
        }
        setShowComparisonModal(true);
    };

    return {
        // State
        step,
        allSkills,
        selectedSkills,
        searchTerm,
        loading,
        recommendations,
        toast,
        selectedForComparison,
        showComparisonModal,
        savedCareerIds,
        showBookmarkTip,
        user,
        // Setters
        setSearchTerm,
        setToast,
        setSelectedForComparison,
        setShowComparisonModal,
        setShowBookmarkTip,
        // Handlers
        handleSkillToggle,
        handleProficiencyChange,
        handleClearSkills,
        handleSubmit,
        handleSaveCareer,
        handleBackToRecommendations,
        handleEmailReport,
        handleDownloadPDF,
        handleViewSkillGap,
        handleToggleComparison,
        handleCompare,
        navigate
    };
};

export default useCareerRecommendation;
