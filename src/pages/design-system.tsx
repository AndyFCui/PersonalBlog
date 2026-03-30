import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Progress,
  ProgressTrack,
  ProgressIndicator,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Linkedin,
  Github,
  Download,
  Menu,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react'

export function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-heading text-xl font-bold">
              AC
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="#"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              shadcn/ui
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Beautifully designed components built with Tailwind CSS and Radix UI.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="#buttons"
                          >
                            <div className="text-sm font-medium leading-none">Buttons</div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              Button variants and sizes
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="#cards"
                          >
                            <div className="text-sm font-medium leading-none">Cards</div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              Card components
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Documentation</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="#installation"
                          >
                            <div className="text-sm font-medium leading-none">Installation</div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              How to install dependencies
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="#typography"
                          >
                            <div className="text-sm font-medium leading-none">Typography</div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              Styles for text
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/">Back to Portfolio</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigation menu
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/">Portfolio</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Components
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Documentation
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {/* Color Palette */}
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4">Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-primary" />
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">var(--primary)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-secondary" />
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs text-muted-foreground">var(--secondary)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-accent" />
                <p className="text-sm font-medium">Accent</p>
                <p className="text-xs text-muted-foreground">var(--accent)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-muted" />
                <p className="text-sm font-medium">Muted</p>
                <p className="text-xs text-muted-foreground">var(--muted)</p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Buttons */}
          <section id="buttons" className="mb-12 scroll-mt-20">
            <h2 className="text-2xl font-heading font-bold mb-4">Buttons</h2>
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>
                  Different button styles for various actions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Button Sizes</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Github className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Button with Icons</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button>
                  <Github className="h-5 w-5" />
                  With Icon
                </Button>
                <Button variant="secondary">
                  <Download className="h-5 w-5" />
                  Download
                </Button>
                <Button variant="outline">
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </Button>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8" />

          {/* Badges */}
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4">Badges</h2>
            <Card>
              <CardHeader>
                <CardTitle>Badge Variants</CardTitle>
                <CardDescription>
                  Neumorphism badges with gradient backgrounds and 3D shadows
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="ghost">Ghost</Badge>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8" />

          {/* Cards */}
          <section id="cards" className="mb-12 scroll-mt-20">
            <h2 className="text-2xl font-heading font-bold mb-4">Cards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description text</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is some card content that demonstrates the card component.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>With Actions</CardTitle>
                  <CardDescription>A card with action buttons</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button size="sm">Action</Button>
                  <Button size="sm" variant="secondary">Cancel</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Card</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/images/profilepic.jpg" alt="User" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Andy Cui</p>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Progress */}
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4">Progress</h2>
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Progress value={75}>
                    <ProgressTrack>
                      <ProgressIndicator style={{ width: '75%' }} />
                    </ProgressTrack>
                  </Progress>
                  <p className="text-sm text-muted-foreground">75% Complete</p>
                </div>
                <div className="space-y-2">
                  <Progress value={45}>
                    <ProgressTrack>
                      <ProgressIndicator style={{ width: '45%' }} />
                    </ProgressTrack>
                  </Progress>
                  <p className="text-sm text-muted-foreground">45% Progress</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8" />

          {/* Accordion */}
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4">Accordion</h2>
            <Card>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is shadcn/ui?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS.
                        It's not a component library, but rather a collection of components you can copy and paste into your projects.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I use these components?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        You can copy the component code directly into your project and customize them as needed.
                        All components are styled with Tailwind CSS and support dark mode.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it free to use?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Yes, all components are completely free to use in your projects.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8" />

          {/* Avatar */}
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4">Avatar</h2>
            <Card>
              <CardContent className="flex items-center gap-6 pt-6">
                <Avatar size="sm">
                  <AvatarImage src="/images/profilepic.jpg" alt="Small" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="/images/profilepic.jpg" alt="Default" />
                  <AvatarFallback>DF</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarImage src="/images/profilepic.jpg" alt="Large" />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8" />

          {/* Dropdown Menu */}
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4">Dropdown Menu</h2>
            <Card>
              <CardContent className="flex gap-4 pt-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Open Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </section>
        </ScrollArea>
      </main>
    </div>
  )
}
