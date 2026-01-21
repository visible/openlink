import defaultComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { Callout } from "fumadocs-ui/components/callout"
import { Card, Cards } from "fumadocs-ui/components/card"
import { File, Folder, Files } from "fumadocs-ui/components/files"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    Accordion,
    Accordions,
    Step,
    Steps,
    Tab,
    Tabs,
    Callout,
    Card,
    Cards,
    File,
    Folder,
    Files,
    ...components,
  }
}
