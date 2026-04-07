/**
 * [INPUT]: 依赖 useState, useRef, useEffect, ReactCrop
 * [OUTPUT]: 导出 CropModal 组件
 * [POS]: resume-editor 模块的子组件，处理图片裁剪弹窗
 * [PROTOCOL]: 变更时更新此头部
 */
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ReactCrop from 'react-image-crop'
import type { Crop } from './utils'

interface CropModalProps {
  open: boolean
  onClose: () => void
  imageFile: File | null
  onCrop: (file: File) => void
}

export function CropModal({ open, onClose, imageFile, onCrop }: CropModalProps) {
  const [crop, setCrop] = useState<Crop | undefined>(undefined)
  const imgRef = useRef<HTMLImageElement>(null)
  const [objUrl, setObjUrl] = useState<string | null>(null)

  // Create object URL when file changes
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      setObjUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setObjUrl(null)
    }
  }, [imageFile])

  // Initialize crop when image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const size = Math.min(img.width, img.height) * 0.8
    setCrop({
      unit: 'px',
      x: (img.width - size) / 2,
      y: (img.height - size) / 2,
      width: size,
      height: size,
    })
  }

  const handleCropChange = (newCrop: Crop) => {
    setCrop(newCrop)
  }

  const handleConfirm = () => {
    const img = imgRef.current
    if (!img || !crop) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height

    canvas.width = crop.width
    canvas.height = crop.height

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], imageFile?.name || 'cropped.png', { type: 'image/png' })
      onCrop(file)
    }, 'image/png')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {objUrl && (
            <div className="flex justify-center bg-muted rounded-lg p-2 overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={objUrl}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  className="max-h-64 object-contain"
                />
              </ReactCrop>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={!crop}>Apply Crop</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
