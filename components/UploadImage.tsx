'use client'
import React from "react";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/database.types";
import {PlusIcon} from "@heroicons/react/20/solid";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function UploadImage({userId}: {
    userId: string
}) {
    const supabase = createClientComponentClient<Database>()
    const [uploading, setUploading] = React.useState(false)
    const router = useRouter()
    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }
            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filepath = `${userId}/${crypto.randomUUID()}.${fileExt}`
            const {error: uploadError} = await supabase.storage.from('clothes').upload(filepath, file)
            if (uploadError) {
                throw uploadError
            }
            router.push('/clothes/new?imagePath=' + filepath)

        } catch (error) {
            console.log(error)
            alert('Error uploading image')
        } finally {
            setUploading(false)

        }
    }
    return (
        <>
            <Button asChild>
                <label htmlFor="file">
                {uploading ? 'Uploading...' : 'Add clothing item'} </label>
            </Button>

            <input
                className="hidden absolute"
                type="file"
                id="file"
                accept="image/*"
                disabled={uploading}
                onChange={uploadImage}
            /></>
    )
}