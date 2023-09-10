import {cookies} from "next/headers";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/database.types";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import NavBar from "@/components/NavBar";
import {Trash} from "lucide-react";
import {XMarkIcon} from "@heroicons/react/20/solid";

export default async function AttributeManagement() {
    const supabase = createServerComponentClient<Database>({cookies})
    const {data: allAttributes} = await supabase.from('attributes').select(
        `title, id,
    attribute_options (
     value, id
    )
`)

    async function createAttribute(formData: FormData) {
        'use server'
        const schema = z.object({
            title: z.string().min(1).max(255)
        })
        const parsed = schema.parse({
            title: formData.get('title'),
        })
        const supabase = createServerComponentClient<Database>({cookies})
        await supabase.from('attributes').insert(parsed)
        revalidatePath('/')
    }

    async function deleteAttribute(formData: FormData) {
        'use server'
        const schema = z.object({
            id: z.string().min(1).max(255)
        })
        const parsed = schema.parse({
            id: formData.get('id'),
        })
        const supabase = createServerComponentClient<Database>({cookies})
        await supabase.from('attributes').delete().eq('id', parsed.id)
        revalidatePath('/')
    }

    async function createAttributeValue(formData: FormData) {
        'use server'
        const schema = z.object({
            value: z.string().min(1).max(255),
            attribute_id: z.number()
        })
        const parsed = schema.parse({
            value: formData.get('value'),
            attribute_id: Number(formData.get('attribute_id')),
        })
        const supabase = createServerComponentClient<Database>({cookies})
        await supabase.from('attribute_options').insert(parsed)
        revalidatePath('/')
    }

    async function deleteAttributeValue(formData: FormData) {
        'use server'
        const schema = z.object({
            id: z.string().min(1).max(255)
        })
        const parsed = schema.parse({
            id: formData.get('id'),
        })
        const supabase = createServerComponentClient<Database>({cookies})
        await supabase.from('attribute_options').delete().eq('id', parsed.id)
        revalidatePath('/')
    }

    return (<>
        <NavBar/>
        <div className="flex flex-col items-start">
            <form action={createAttribute}>
                <div className="flex gap-4 items-center my-4">
                    <Input type="text" name="title" placeholder="New attribute"/>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
            <ul className="text-foreground">
                {allAttributes?.map((attribute) => (
                    <li key={attribute.id}>
                        <div className={"flex items-center gap-2"}>{attribute.title}
                            <form action={deleteAttribute}>
                                <div>
                                    <Input type="hidden" name="id" value={attribute.id}/>
                                    <button type="submit" className={"text-destructive"}><Trash/></button>
                                </div>
                            </form>
                        </div>
                        <br/>
                        <ul className="list-disc list-inside text-sm">
                            {attribute.attribute_options?.map((option) => (
                                <li className={"flex items-center gap-2"} key={option.id}>- {option.value}
                                        <form action={deleteAttributeValue}>

                                                <Input type="hidden" name="id" value={option.id}/>
                                                <button type="submit" className={"text-destructive"}><XMarkIcon className={'w-6'}/></button>

                                        </form>
                                </li>
                                ))}
                            <li className="list-none">
                                <form action={createAttributeValue}>
                                    <div className="flex gap-4 items-center mt-2 mb-6">
                                        <Input type="text" name="value" placeholder="New attribute value"/>
                                        <Input type="hidden" name="attribute_id" value={attribute.id}/>
                                        <Button type="submit">Submit</Button>
                                    </div>
                                </form>
                            </li>
                        </ul>
                    </li>
                    ))}
            </ul>
        </div>
    </>
)

}