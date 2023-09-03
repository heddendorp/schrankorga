import {createServerActionClient, createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {Database} from "@/database.types";
import {z} from "zod";
import {revalidatePath} from "next/cache";

export default async function Index() {
    const supabase = createServerComponentClient<Database>({cookies})

    const {data: clothes} = await supabase.from('clothes').select() // {data, error} is destructuring

    async function create(formData: FormData) {
        'use server'
        const supabase = createServerActionClient<Database>({cookies})
        const schema = z.object({
            name: z.string().min(1).max(255)
        })
        const parsed = schema.parse({
            name: formData.get('name'),
        })
       await supabase.from('clothes').insert(parsed)
        revalidatePath('/')
    }

    return (<>
            <form action={create}>
                <input type="text" name="name"/>
            </form>
            <ul className="my-auto text-foreground">
                {clothes?.map((cloth) => (
                    <li key={cloth.id}>{cloth.id} {cloth.name} </li>
                ))}
            </ul>
        </>
    )
}