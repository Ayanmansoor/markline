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
      <DialogContent className="w-full max-w-[500px] bg-transparent max-h-[90vh] overflow-y-auto border-none shadow-none p-0 ">
        <div className="w-full bg-white rounded-3xl p-4 md:p-8 shadow-2xl relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 text-gray-300 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col gap-1 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Public Manifesto</span>
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter  leading-none">
              Document your Experience
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">{productName}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Rating Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-black">Product Validation Score</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setValue('rating', star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      size={28}
                      className={`${(hoverRating || currentRating) >= star ? 'text-black fill-orange-500' : 'text-gray-500'} transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-black border-l-2 border-black pl-3 ml-1">Headline</label>
              <input
                {...register('title')}
                placeholder="EPITOMIZED ELEGANCE..."
                className="w-full bg-gray-50 border-2 border-gray-400 rounded-xl px-4 py-3 text-sm font-bold bg-white border-black transition-all outline-none uppercase placeholder:text-gray-400"
              />
              {errors.title && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{errors.title.message}</p>}
            </div>

            {/* Comment */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-black border-l-2 border-black pl-3 ml-1">Detailed Log</label>
              <textarea
                {...register('comment')}
                rows={4}
                placeholder="DESCRIBE THE CRAFTSMANSHIP, COMFORT AND DURABILITY..."
                className="w-full bg-gray-50 border-2 border-gray-400 rounded-xl px-4 py-4 text-sm font-bold bg-white border-black transition-all outline-none resize-none uppercase placeholder:text-gray-400 leading-relaxed"
              />
              {errors.comment && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{errors.comment.message}</p>}
            </div>

            {/* Visual Documentation (Images) */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-black border-l-2 border-black pl-3 ml-1">Visual Evidence (max 5)</label>
              <div className="flex flex-wrap gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-black hover:text-black transition-all"
                  >
                    <ImagePlus size={20} />
                    <span className="text-[8px] font-bold uppercase">Add</span>
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

            <div className="pt-4 flex flex-col gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-black/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>DOCUMENTING...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>SUBMIT MANIFESTO</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <span className="w-4 h-[1px] bg-gray-200"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Verified Registry Entry</span>
                <span className="w-4 h-[1px] bg-gray-200"></span>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddReviewForm
