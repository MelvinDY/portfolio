import { Card } from "@/components/ui/card"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
}

interface BlogCardProps {
  post: BlogPost
  variant?: "home" | "full"
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.id}`} className="block">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg md:text-xl font-semibold hover:text-primary transition-colors mb-3 line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          </div>
          
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
            
            <span className="text-muted-foreground text-sm">
              {post.date}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  )
}