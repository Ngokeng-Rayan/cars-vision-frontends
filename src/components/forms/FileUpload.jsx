import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

const FileUpload = ({
    label,
    accept = 'image/*',
    multiple = false,
    maxSize = 5, // MB
    onFilesChange,
    error,
    required = false
}) => {
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef(null)

    const handleFiles = (newFiles) => {
        const fileArray = Array.from(newFiles)

        // Vérifier la taille
        const validFiles = fileArray.filter(file => {
            const sizeMB = file.size / (1024 * 1024)
            return sizeMB <= maxSize
        })

        if (validFiles.length !== fileArray.length) {
            alert(`Certains fichiers dépassent ${maxSize}MB`)
        }

        // Créer les previews
        const newPreviews = validFiles.map(file => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name
        }))

        if (multiple) {
            setFiles([...files, ...validFiles])
            setPreviews([...previews, ...newPreviews])
            onFilesChange?.([...files, ...validFiles])
        } else {
            setFiles(validFiles)
            setPreviews(newPreviews)
            onFilesChange?.(validFiles)
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files)
        }
    }

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)
        setFiles(newFiles)
        setPreviews(newPreviews)
        onFilesChange?.(newFiles)
    }

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${dragActive
                        ? 'border-[#4DB896] bg-[#4DB896]/5'
                        : error
                            ? 'border-red-300 hover:border-red-400'
                            : 'border-gray-300 hover:border-[#4DB896]'
                    }
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    className="hidden"
                />

                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                    Cliquez ou glissez-déposez vos fichiers
                </p>
                <p className="text-xs text-gray-500">
                    {accept.includes('image') ? 'PNG, JPG, GIF' : 'Tous fichiers'} jusqu'à {maxSize}MB
                </p>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                {preview.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFile(index)
                                }}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <p className="text-xs text-gray-600 mt-1 truncate">{preview.name}</p>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}

export default FileUpload
