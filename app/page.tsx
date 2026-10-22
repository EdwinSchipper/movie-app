import Image from 'next/image'

export default function Page() {
  return <div>
    <h1>Movie for Friends App</h1>
    <Image src="/profile.jpg" alt="Profile" width={200} height={100} />
  </div>
}