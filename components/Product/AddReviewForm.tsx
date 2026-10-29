'use client'
import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Star, Loader2, X, ImagePlus, CheckCircle2, Trash2 } from 'lucide-react'
import { addReview, uploadReviewImage } from '@/Supabase/SupabaseApi'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

const reviewSchema = z.object({
  title: z.string().min(2, "Headline is too short").max(100),
  comment: z.string().min(5, "Experience detail is required").max(1000),
  rating: z.number().min(1).max(5),
})

type ReviewInputs = z.infer<typeof reviewSchema>

interface AddReviewFormProps {
  productId: number;
  userId: string;
  productName: string;
  onSuccess?: () => void;
  children: React.ReactNode;
}

function AddReviewForm({ productId, userId, productName, onSuccess, children }: AddReviewFormProps) {
  const [open, setOpen] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewInputs>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 }
  })

  const currentRating = watch('rating')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (selectedFiles.length + files.length > 5) {
      toast.error("Visual documentation limited to 5 assets")
      return
    }

    const newFiles = [...selectedFiles, ...files]
    setSelectedFiles(newFiles)

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)

    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const onSubmit = async (data: ReviewInputs) => {
    try {
      setIsSubmitting(true)
      
      const uploadedUrls: string[] = []
      
      if (selectedFiles.length > 0) {
        toast.info(`Uploading ${selectedFiles.length} documentation assets...`)
        for (const file of selectedFiles) {
          const url = await uploadReviewImage(file)
          uploadedUrls.push(url)
        }
      }

      await addReview({
        ...data,
        product_id: productId,
        user_id: userId,
        is_verified: false,
        likes: 0,
        image_urls: uploadedUrls
      })
      
      toast.success("Review registered in the manifest")
      setOpen(false)
      reset()
      setSelectedFiles([])
      setPreviews([])
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to document your experience")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-[500px] bg-white rounded-2xl border border-zinc-200/80 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-1 mb-6 text-left">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Customer Review</span>
          <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight">
            Share Your Experience
          </DialogTitle>
          {productName && <p className="text-xs text-zinc-500 font-medium mt-0.5">{productName}</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Rating Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Your Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue('rating', star)}
                  className="p-1 transition-transform active:scale-95"
                >
                  <Star
                    size={22}
                    className={`${(hoverRating || currentRating) >= star ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'} transition-colors duration-150`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-[11px] font-medium text-red-500 mt-1">{errors.rating.message}</p>}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Review Title</label>
            <input
              {...register('title')}
              placeholder="e.g. Exceptional fit and craftsmanship"
              className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors outline-none placeholder:text-zinc-400"
            />
            {errors.title && <p className="text-[11px] font-medium text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Detailed Review</label>
            <textarea
              {...register('comment')}
              rows={4}
              placeholder="Describe the craftsmanship, comfort, fit and materials..."
              className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors outline-none resize-none placeholder:text-zinc-400 leading-relaxed"
            />
            {errors.comment && <p className="text-[11px] font-medium text-red-500 mt-1">{errors.comment.message}</p>}
          </div>

          {/* Visual Documentation (Images) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Photos <span className="text-zinc-400 font-normal">(optional, max 5)</span></label>
            <div className="flex flex-wrap gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 group">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl border border-dashed border-zinc-300 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-all"
                >
                  <ImagePlus size={16} />
                  <span className="text-[9px] font-medium uppercase">Add</span>
                </button>
              )}
            </div>
            <input 
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:bg-zinc-300 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddReviewForm
