'use client'
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/database.types";
import React from "react";
import {Button} from "@/components/ui/button";
import NavBar from "@/components/NavBar";

export const dynamic='force-dynamic';
export default function NewClothing({searchParams}: {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}) {
    const supabase = createClientComponentClient<Database>()

    const [allAttributes, setAllAttributes] = React.useState<{
        title: string, id: number, attribute_options: {
            value: string, id: number,
        }[]
    }[]>([])

    React.useEffect(() => {
        async function getAllAttributes() {
            const {data: allAttributes} = await supabase.from('attributes').select(`title, id,
                  attribute_options (
                    value, id
                  )
                `)
            if (!allAttributes) {
                throw new Error('No attributes')
            }
            setAllAttributes(allAttributes)
        }

        void getAllAttributes()
    }, [supabase])

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

        const imagePath = searchParams.imagePath
        console.log(Object.entries(searchParams))
        if (!imagePath || typeof imagePath !== 'string') {
            throw new Error('No image path')
        }
        void getImage(imagePath)
    }, [searchParams, supabase])

    const [list, setList] = React.useState<number[]>([])
    const toggleOption = (optionID: number) => {
        setList((preList) => {
            if (preList.includes(optionID)) {
                return preList.filter(id => id !== optionID)
            } else {
                return [optionID, ...preList]
            }
        })
    }

    const saveClothes = async () => {
        const imagePath = searchParams.imagePath
        if (!imagePath || typeof imagePath !== 'string') {
            throw new Error('No image path')
        }
        const item = await supabase.from("clothes").insert({
            picture_url: imagePath
        }).select("id")
        const clothingId = item.data?.at(0)?.id
        if (!clothingId) {
            throw new Error('No Id found')
        }
        for (const optionID of list) {
            await supabase.from("cloth_attribute_options").insert({
                cloth_id: clothingId,
                attribute_option_id: optionID
            })
        }
    }

    return (<>
            <NavBar/>
            {imageUrl && <div className="flex justify-center md:justify-start">
                <img src={imageUrl} alt="Clothing item"
                     className="rounded-md object-contain h-auto w-[90vw] md:h-[50vh] md:w-auto"/>
            </div>}
            {allAttributes?.map((attribute) => (<div className="mt-4" key={attribute.id}>
                    <h2>{attribute.title}</h2>
                    <div className="flex gap-1">
                        {attribute.attribute_options?.map((option) => (
                            <span key={option.id} onClick={() => toggleOption(option.id)}
                                  className={`inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium ring-1 ring-inset ${list.includes(option.id) ? 'ring-primary/10 text-primary' : 'ring-slate-500/10 text-foreground'}`}>{option.value}</span>))}
                    </div>
                </div>))}
       <div className={"mt-4"}><Button onClick={()=>saveClothes()}>Save item</Button></div>

            {/*<form action={create}>*/}
            {/*    <div className="flex flex-row gap-4 items-end">*/}
            {/*        <div>*/}
            {/*            <label htmlFor="name"*/}
            {/*                   className="block text-sm font-medium leading-6 text-foreground">Name</label>*/}
            {/*            <div className="mt-2">*/}
            {/*                <input type="text" name="name" id="name"*/}
            {/*                       className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
            {/*                       placeholder="Shirt"/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <button type="submit"*/}
            {/*                className="inline-flex items-center gap-x-1.5 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">*/}
            {/*            <PlusIcon className="-ml-0.5 h-5 w-5"></PlusIcon>*/}
            {/*            Add item*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</form>*/}
        </>)
}