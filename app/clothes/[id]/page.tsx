import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/database.types";
import {cookies} from "next/headers";
import ClothingImage from "@/components/ClothingImage";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import {ArrowUturnLeftIcon, XMarkIcon} from "@heroicons/react/20/solid";
import React from "react";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default async function ({params}: { params: { [param: string]: any } }) {
    const supabase = createServerComponentClient<Database>({cookies})
    const {data: clothingItem, error} = await supabase.from('clothes').select(
        `picture_url, id,
    attribute_options (
     value, id, attributes (title, id)
    )`).eq("id", params.id)
    if (error) throw new Error(error.message)
    const imagePath = clothingItem?.at(0)?.picture_url


    return (<>
            <NavBar/>
            <div className={"flex gap-8 mb-4"}>
                <Link className="flex items-center" href="/"><ArrowUturnLeftIcon
                    className={"w-6 text-primary mr-2"}/> Back</Link>
            </div>
            <div>
                {imagePath && <ClothingImage imagePath={imagePath}/>}
            </div>
            <ul>
                {clothingItem?.at(0)?.attribute_options.map(attribute => (
                    <li key={attribute.id}>{attribute.attributes?.title}: {attribute.value}</li>
                ))}
            </ul>
            {/*<form action={deleteClothes}>*/}

            {/*    <Input type="hidden" name="id" value={clothingItem.id}/>*/}
            {/*    <Button className={"mt-4"} type="submit">Delete Item</Button>*/}

            {/*</form>*/}
        </>
    )
}