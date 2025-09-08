/**
 * EditSubject Page Component
 * Wrapper component for SubjectForm in edit mode
 */

import React from 'react';
import SubjectForm from './SubjectForm';

const EditSubject = () => {
  return <SubjectForm mode="edit" />;
};

export default EditSubject;
