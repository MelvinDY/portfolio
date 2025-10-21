import { Card } from "@/components/ui/card"
import { BookOpen, Code, Zap } from "lucide-react"

const learningItems = [
  {
    category: "Exploring",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    items: [
      { name: "Rust", description: "Systems programming & performance optimization" },
      { name: "WebAssembly", description: "High-performance web applications" },
    ]
  },
  {
    category: "Building With",
    icon: Code,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    items: [
      { name: "Next.js 15", description: "Latest features & server components" },
      { name: "Supabase", description: "Real-time database & authentication" },
    ]
  },
  {
    category: "Experimenting",
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    items: [
      { name: "Three.js", description: "3D graphics & interactive experiences" },
      { name: "AI Integration", description: "LLM APIs & prompt engineering" },
    ]
  }
]

export default function CurrentlyLearning() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {learningItems.map((category) => {
        const Icon = category.icon
        return (
          <Card key={category.category} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <Icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <h3 className="text-lg font-semibold">{category.category}</h3>
              </div>

              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
