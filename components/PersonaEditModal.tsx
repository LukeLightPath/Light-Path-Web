import React, { useState, useEffect, FormEvent } from 'react';
import { Persona } from '../utils/personaService';
import { InfoIcon } from './icons';

interface PersonaEditModalProps {
    persona: Persona | null;
    onSave: (personaData: Partial<Persona>) => Promise<void>;
    onDelete: () => Promise<void>;
    onClose: () => void;
}

type ValidationErrors = {
    [key in keyof Persona]?: string;
};

// Data for tooltips
const tooltipData = {
    personaName: "Name for this voice style. Helps you recognise and switch between personas.",
    roleTitle: "What this persona does professionally. Shapes authority and perspective in the writing.",
    industry: "The main industry your persona works in. Helps guide examples and context used in posts.",
    typicalAudience: "Who your content is aimed at. Ensures the writing addresses the right readers.",
    resultsYouCreate: "The outcome your persona helps clients achieve. Drives the value-focused tone in posts.",
    tone: "The overall voice style. Influences emotion, confidence, and personality in posts.",
    keyTopics: "The main subjects this persona talks about. Used to keep content on-brand and relevant.",
    humour: "How much humour this persona uses. Helps shape light, dry, or serious delivery.",
    hookPreference: "How often this persona opens posts with a bold hook. Influences first-line intensity.",
    backgroundStory: "A bit of personal/professional history that adds depth to the writing voice.",
    quirks: "Unique writing habits or stylistic traits that make the persona feel real.",
    formattingRules: "Custom rules like paragraph length, hashtag usage, or structure preferences.",
    lineBreaks: "Whether the persona prefers spaced-out paragraphs for readability.",
    prefersLists: "Whether the persona uses bullet-point lists to organise ideas.",
};

// Reusable Tooltip Component
const Tooltip: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="relative flex items-center group">
            <InfoIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs text-white bg-slate-800 dark:bg-slate-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none text-center">
                {text}
            </div>
        </div>
    );
};


const PersonaEditModal: React.FC<PersonaEditModalProps> = ({ persona, onSave, onDelete, onClose }) => {
    const [formData, setFormData] = useState<Partial<Persona>>({});
    const [keyTopicsStr, setKeyTopicsStr] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (persona) {
            setFormData(persona);
            setKeyTopicsStr(persona.keyTopics?.join(', ') || '');
        } else {
            // Default state for a new persona
            setFormData({ lineBreaks: true, prefersLists: false });
        }
    }, [persona]);

    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};
        if (!formData.personaName?.trim()) newErrors.personaName = 'Persona Name is required.';
        if (!formData.roleTitle?.trim()) newErrors.roleTitle = 'Role / Title is required.';
        if (!formData.industry?.trim()) newErrors.industry = 'Industry is required.';
        if (!formData.typicalAudience?.trim()) newErrors.typicalAudience = 'Typical Audience is required.';
        if (!formData.resultsYouCreate?.trim()) newErrors.resultsYouCreate = 'Results You Create is required.';
        if (!formData.tone?.trim()) newErrors.tone = 'Tone is required.';
        if (!keyTopicsStr.trim()) newErrors.keyTopics = 'At least one Key Topic is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) {
            setServerError('Please fill in all required fields highlighted below.');
            return;
        }

        setIsSaving(true);
        const keyTopicsArray = keyTopicsStr.split(',').map(t => t.trim()).filter(t => t);
        
        try {
            await onSave({ ...formData, keyTopics: keyTopicsArray });
        } catch (err: any) {
            setServerError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this persona? This will remove your saved voice for this tool.");
        if (confirmed) {
            setIsDeleting(true);
            setServerError(null);
            try {
                await onDelete();
            } catch (err: any) {
                setServerError(err.message || "An unexpected error occurred.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSave} noValidate>
                    <div className="p-6 sm:p-8 sticky top-0 bg-white dark:bg-slate-800 z-10 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading">
                            {persona ? 'Edit Persona' : 'Create Persona'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">This voice will be used to generate your LinkedIn posts.</p>
                        {serverError && <p className="mt-2 text-sm text-red-500">{serverError}</p>}
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Required Fields */}
                        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
                            <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 font-heading mb-4">Core Identity (Required)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="personaName" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span>Persona Name</span>
                                        <Tooltip text={tooltipData.personaName} />
                                    </label>
                                    <input type="text" name="personaName" value={formData.personaName || ''} onChange={handleChange} className={`mt-1 w-full input ${errors.personaName ? 'input-error' : ''}`} />
                                    {errors.personaName && <p className="error-text">{errors.personaName}</p>}
                                </div>
                                 <div>
                                    <label htmlFor="roleTitle" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span>Role / Title</span>
                                        <Tooltip text={tooltipData.roleTitle} />
                                    </label>
                                    <input type="text" name="roleTitle" value={formData.roleTitle || ''} onChange={handleChange} className={`mt-1 w-full input ${errors.roleTitle ? 'input-error' : ''}`} />
                                    {errors.roleTitle && <p className="error-text">{errors.roleTitle}</p>}
                                </div>
                                <div>
                                    <label htmlFor="industry" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Industry</span>
                                      <Tooltip text={tooltipData.industry} />
                                    </label>
                                    <input type="text" name="industry" value={formData.industry || ''} onChange={handleChange} className={`mt-1 w-full input ${errors.industry ? 'input-error' : ''}`} />
                                    {errors.industry && <p className="error-text">{errors.industry}</p>}
                                </div>
                                <div>
                                    <label htmlFor="typicalAudience" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Typical Audience</span>
                                      <Tooltip text={tooltipData.typicalAudience} />
                                    </label>
                                    <input type="text" name="typicalAudience" value={formData.typicalAudience || ''} onChange={handleChange} className={`mt-1 w-full input ${errors.typicalAudience ? 'input-error' : ''}`} />
                                    {errors.typicalAudience && <p className="error-text">{errors.typicalAudience}</p>}
                                </div>
                                 <div className="md:col-span-2">
                                    <label htmlFor="resultsYouCreate" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Results You Create</span>
                                      <Tooltip text={tooltipData.resultsYouCreate} />
                                    </label>
                                    <textarea name="resultsYouCreate" value={formData.resultsYouCreate || ''} onChange={handleChange} rows={3} className={`mt-1 w-full input ${errors.resultsYouCreate ? 'input-error' : ''}`} />
                                    {errors.resultsYouCreate && <p className="error-text">{errors.resultsYouCreate}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="tone" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Tone</span>
                                      <Tooltip text={tooltipData.tone} />
                                    </label>
                                    <input type="text" name="tone" value={formData.tone || ''} onChange={handleChange} className={`mt-1 w-full input ${errors.tone ? 'input-error' : ''}`} placeholder="e.g., direct, confident, conversational" />
                                    {errors.tone && <p className="error-text">{errors.tone}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="keyTopics" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Key Topics (comma-separated)</span>
                                      <Tooltip text={tooltipData.keyTopics} />
                                    </label>
                                    <input type="text" name="keyTopics" value={keyTopicsStr} onChange={(e) => setKeyTopicsStr(e.target.value)} className={`mt-1 w-full input ${errors.keyTopics ? 'input-error' : ''}`} />
                                    {errors.keyTopics && <p className="error-text">{errors.keyTopics}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Optional Fields */}
                        <div>
                             <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 font-heading mb-4">Voice & Style (Optional)</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label htmlFor="humour" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Humour</span>
                                      <Tooltip text={tooltipData.humour} />
                                    </label>
                                    <input type="text" name="humour" value={formData.humour || ''} onChange={handleChange} className="mt-1 w-full input" placeholder="e.g., none, light, noticeable"/>
                                </div>
                                 <div>
                                    <label htmlFor="hookPreference" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Hook Preference</span>
                                      <Tooltip text={tooltipData.hookPreference} />
                                    </label>
                                    <select name="hookPreference" value={formData.hookPreference || 'sometimes'} onChange={handleChange} className="mt-1 w-full input">
                                        <option value="never">Never</option>
                                        <option value="sometimes">Sometimes</option>
                                        <option value="always">Always</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="backgroundStory" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Background Story</span>
                                      <Tooltip text={tooltipData.backgroundStory} />
                                    </label>
                                    <textarea name="backgroundStory" value={formData.backgroundStory || ''} onChange={handleChange} rows={4} className="mt-1 w-full input" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="quirks" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Quirks</span>
                                      <Tooltip text={tooltipData.quirks} />
                                    </label>
                                    <textarea name="quirks" value={formData.quirks || ''} onChange={handleChange} rows={3} className="mt-1 w-full input" placeholder="e.g., British dry humour, short punchy lines, no emojis" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="formattingRules" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                      <span>Extra Formatting Rules</span>
                                      <Tooltip text={tooltipData.formattingRules} />
                                    </label>
                                    <textarea name="formattingRules" value={formData.formattingRules || ''} onChange={handleChange} rows={2} className="mt-1 w-full input" />
                                </div>
                                 <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <input type="checkbox" name="lineBreaks" id="lineBreaks" checked={formData.lineBreaks || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                        <label htmlFor="lineBreaks" className="ml-2 flex items-center gap-1.5 text-sm text-slate-900 dark:text-slate-300">
                                            <span>Use line breaks</span>
                                            <Tooltip text={tooltipData.lineBreaks} />
                                        </label>
                                    </div>
                                     <div className="flex items-center">
                                        <input type="checkbox" name="prefersLists" id="prefersLists" checked={formData.prefersLists || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                        <label htmlFor="prefersLists" className="ml-2 flex items-center gap-1.5 text-sm text-slate-900 dark:text-slate-300">
                                            <span>Prefers lists</span>
                                            <Tooltip text={tooltipData.prefersLists} />
                                        </label>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 flex justify-between items-center sticky bottom-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm z-10 border-t border-slate-200 dark:border-slate-700">
                        <div>
                            {persona && (
                                <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors disabled:opacity-50">
                                    {isDeleting ? 'Deleting...' : 'Delete Persona'}
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors font-semibold">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:bg-primary-400 disabled:cursor-not-allowed">
                                {isSaving ? 'Saving...' : 'Save Persona'}
                            </button>
                        </div>
                    </div>
                </form>
                 <style>{`
                    .input {
                        padding: 0.5rem 0.75rem;
                        border: 2px solid #cbd5e1;
                        background-color: #ffffff;
                        border-radius: 0.5rem;
                        outline: none;
                        transition: all 0.2s;
                    }
                    .dark .input {
                        background-color: #1e293b;
                        border-color: #475569;
                    }
                    .input:focus {
                        --tw-ring-color: #0ea5e9;
                        border-color: #0ea5e9;
                        box-shadow: 0 0 0 2px var(--tw-ring-color);
                    }
                    .input-error {
                        border-color: #ef4444;
                    }
                    .error-text {
                        color: #ef4444;
                        font-size: 0.875rem;
                        margin-top: 0.25rem;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default PersonaEditModal;