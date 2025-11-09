import React, { useState, useEffect } from 'react';
import TradeForm from './TradeForm';
import JournalEntryList from './JournalEntryList';

const TradingJournalForm = () => {
  const [form, setForm] = useState({
    pair: '',
    type: 'Buy',
    date: '',
    time: '',
    session: '',
    emotions: [],
    setupImage: '',
    entryImage: '',
    profitImage: '',
    traderIdeaMorning: '',
    traderIdeaNoon: '',
    traderIdeaEvening: '',
  });

  const [journal, setJournal] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [visibleIdeas, setVisibleIdeas] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tradingJournal')) || [];
    setJournal(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'time') {
      let session = '';
      const [hour] = value.split(':').map(Number);
      if (hour >= 3 && hour < 8) session = 'Asian';
      else if (hour >= 10 && hour < 14) session = 'London';
      else if (hour >= 15 && hour <= 20) session = 'New York';
      setForm((prev) => ({ ...prev, [name]: value, session }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEmotionToggle = (emotion) => {
    setForm((prev) => {
      const emotions = prev.emotions.includes(emotion)
        ? prev.emotions.filter((e) => e !== emotion)
        : [...prev.emotions, emotion];
      return { ...prev, emotions };
    });
  };

  const handleImage = (e, imageType) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, [imageType]: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedJournal = [...journal];
    if (editIndex !== null) {
      updatedJournal[editIndex] = form;
    } else {
      updatedJournal.push(form);
    }
    localStorage.setItem('tradingJournal', JSON.stringify(updatedJournal));
    setJournal(updatedJournal);
    resetForm();
  };

  const handleEdit = (index) => {
    setForm(journal[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (index) => {
    const updatedJournal = journal.filter((_, i) => i !== index);
    localStorage.setItem('tradingJournal', JSON.stringify(updatedJournal));
    setJournal(updatedJournal);
    resetForm();
  };

  const toggleIdeaVisibility = (index) => {
    setVisibleIdeas((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const resetForm = () => {
    setForm({
      pair: '',
      type: 'Buy',
      date: '',
      time: '',
      session: '',
      emotions: [],
      setupImage: '',
      entryImage: '',
      profitImage: '',
      traderIdeaMorning: '',
      traderIdeaNoon: '',
      traderIdeaEvening: '',
    });
    setEditIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      <TradeForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onImageChange={handleImage}
        onEmotionToggle={handleEmotionToggle}
        editIndex={editIndex}
      />

      <JournalEntryList
        journal={journal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        visibleIdeas={visibleIdeas}
        toggleIdeaVisibility={toggleIdeaVisibility}
      />
    </div>
  );
};

export default TradingJournalForm;
