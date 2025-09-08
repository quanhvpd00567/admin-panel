/**
 * CreateSubject Component
 * Wrapper component for creating new subjects
 */

import React from 'react';
import SubjectForm from './SubjectForm';

const CreateSubject = () => {
  return <SubjectForm mode="create" />;
};

export default CreateSubject;