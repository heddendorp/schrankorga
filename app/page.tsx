import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '../components/LogoutButton'
import SupabaseLogo from '../components/SupabaseLogo'
import NextJsLogo from '../components/NextJsLogo'
import UploadImage from "@/components/UploadImage";
import {Database} from "@/database.types";
import {redirect} from "next/navigation";
import NavBar from "@/components/NavBar";

export const dynamic = 'force-dynamic'

export default async function Index() {
  const supabase = createServerComponentClient<Database>({cookies})
  const {data: {session}} = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  return (<>
    <NavBar/>
    <div className="w-full flex flex-col items-center">
      <UploadImage userId={session?.user?.id}/>
    </div>
    </>
  )
}
