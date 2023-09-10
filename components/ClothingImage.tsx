"use client"
import React from "react";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/database.types";

export default function ClothingImage({imagePath}:{imagePath:string}){
    const supabase = createClientComponentClient<Database>()

    const [imageUrl, setImageUrl] = React.useState<string | null>(null)

    React.useEffect(() => {
        async function getImage(imagePath: string) {
            try {
                const {data, error} = await supabase.storage.from('clothes').download(imagePath)
                if (error) {
                    throw error
                }
                const url = URL.createObjectURL(data)
                setImageUrl(url)
            } catch (error) {
                console.log(error)
                alert('Error loading image')
            }
        }

        if (!imagePath) {
            throw new Error('No image path')
        }
        void getImage(imagePath)
    }, [imagePath, supabase])
    return (<>
        {imageUrl &&
            <img src={imageUrl} alt="Clothing item"
                 className="rounded-md object-contain h-auto w-[90vw] md:h-[50vh] md:w-auto"/>
        }
        </>
    )
}