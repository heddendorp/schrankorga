import {createServerActionClient, createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {Database} from "@/database.types";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {PlusIcon} from "@heroicons/react/20/solid";
import UploadImage from "@/components/UploadImage";
import {redirect} from "next/navigation";

export default async function Index() {
    const supabase = createServerComponentClient<Database>({cookies})
    const {data: {session}} = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }
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
        // await supabase.from('clothes').insert(parsed)
        revalidatePath('/')
    }


    return (<div className="my-auto space-y-4">
            <form action={create}>
                <div className="flex flex-row gap-4 items-end">
                    <div>
                        <label htmlFor="name"
                               className="block text-sm font-medium leading-6 text-foreground">Name</label>
                        <div className="mt-2">
                            <input type="text" name="name" id="name"
                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                   placeholder="Shirt"/>
                        </div>
                    </div>
                    <button type="submit"
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                        <PlusIcon className="-ml-0.5 h-5 w-5"></PlusIcon>
                        Add item
                    </button>
                </div>
            </form>
            <ul className="text-foreground">
                {/*{clothes?.map((cloth) => (*/}
                {/*    <li key={cloth.id}>{cloth.id} {cloth.name} </li>*/}
                {/*))}*/}
            </ul>
        </div>
    )
}
