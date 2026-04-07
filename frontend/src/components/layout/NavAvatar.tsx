import avatar from "../../assets/images/image-avatar.png"

export default function NavAvatar({ border }: { border: string }) {
  return (
    <div className={`rounded-full bg-gray-600 overflow-hidden ${border}`}>
      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
    </div>
  )
}
