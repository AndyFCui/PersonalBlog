/**
 * [INPUT]: 依赖 flushSync, Button, Save, ResumeData, WorkExperienceForm, EducationForm
 * [OUTPUT]: 导出 ResumeEditor 组件
 * [POS]: resume-editor 模块的子组件，编辑简历（工作经历+教育经历）
 * [PROTOCOL]: 变更时更新此头部
 */
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ResumeData } from '@/types/resume'
import { WorkExperienceForm } from './WorkExperienceForm'
import { EducationForm } from './EducationForm'

interface ResumeEditorProps {
  data: ResumeData
  onChange: (d: ResumeData) => void
  onSave: (data?: ResumeData) => void
  saving: boolean
}

export function ResumeEditor({
  data,
  onChange,
  onSave,
  saving,
}: ResumeEditorProps) {
  const updateWork = (index: number, field: string, value: string | string[]) => {
    const newWork = [...data.work]
    newWork[index] = { ...newWork[index], [field]: value }
    onChange({ ...data, work: newWork })
  }

  const addWork = () => {
    const newData = {
      ...data,
      work: [
        ...data.work,
        { company: '', title: '', years: '', image: '', description: [''] },
      ],
    }
    flushSync(() => {
      onChange(newData)
    })
  }

  const removeWork = (index: number) => {
    const newData = { ...data, work: data.work.filter((_, i) => i !== index) }
    flushSync(() => {
      onChange(newData)
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...data.education]
    newEdu[index] = { ...newEdu[index], [field]: value }
    onChange({ ...data, education: newEdu })
  }

  const addEducation = () => {
    const newData = {
      ...data,
      education: [
        ...data.education,
        {
          school: '',
          degree: '',
          graduated: '',
          Coursework: '',
          description: '',
          image: '',
          honor: '',
          awards: '',
          schoolLink: '',
        },
      ],
    }
    flushSync(() => {
      onChange(newData)
    })
  }

  const removeEducation = (index: number) => {
    const newData = {
      ...data,
      education: data.education.filter((_, i) => i !== index),
    }
    flushSync(() => {
      onChange(newData)
    })
  }

  return (
    <div className="space-y-6">
      <WorkExperienceForm
        workExperiences={data.work}
        onUpdate={updateWork}
        onAdd={addWork}
        onRemove={removeWork}
      />

      <EducationForm
        educations={data.education}
        onUpdate={updateEducation}
        onAdd={addEducation}
        onRemove={removeEducation}
      />

      <div className="flex justify-end">
        <Button onClick={() => onSave(data)} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Resume'}
        </Button>
      </div>
    </div>
  )
}
