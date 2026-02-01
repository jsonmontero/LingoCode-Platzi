export const MODULES = [
  {
    id: 1,
    title: 'Programming Foundations',
    description: 'Learn what programming is and write your first code',
    lessons: [
      {
        id: 1,
        title: 'What is Programming?',
        duration: '5 min',
        content: `
# What is Programming?

Programming is giving **instructions** to a computer.

## Your First Code

\`\`\`python
print("Hello, World!")
\`\`\`

## English Tip 💡

**"Print"** in programming means "show on screen"!
        `,
        exercise: {
          instruction: 'Write code to print "Hello LingoCode!"',
          language: 'python',
          starterCode: '# Write your code below\n',
          solution: 'print("Hello LingoCode!")',
          hint: 'Use print("your message")'
        }
      },
      {
        id: 2,
        title: 'Variables',
        duration: '5 min',
        content: `
# Variables

A **variable** stores data.

\`\`\`python
name = "Carlos"
age = 25
print(name)
print(age)
\`\`\`

## English Tip 💡

**"Variable"** comes from "vary" - it can change!
        `,
        exercise: {
          instruction: 'Create a variable "name" with your name and print it',
          language: 'python',
          starterCode: '# Create variable and print\n',
          solution: 'name = "Student"\nprint(name)',
          hint: 'Use name = "your name"'
        }
      },
      {
        id: 3,
        title: 'Data Types',
        duration: '5 min',
        content: `
# Data Types

- **String**: text like "Hello"
- **Integer**: numbers like 42
- **Boolean**: True or False

\`\`\`python
text = "Hello"
number = 42
is_true = True
print(type(text))
\`\`\`
        `,
        exercise: {
          instruction: 'Create a number variable and print its type',
          language: 'python',
          starterCode: '# Create number and print type\n',
          solution: 'number = 100\nprint(type(number))',
          hint: 'Use type(variable)'
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Control Flow',
    description: 'Conditionals and loops',
    lessons: [
      {
        id: 1,
        title: 'If Statements',
        duration: '5 min',
        content: `
# If Statements

\`\`\`python
age = 18
if age >= 18:
    print("Adult")
else:
    print("Minor")
\`\`\`
        `,
        exercise: {
          instruction: 'Write an if statement that prints "Big" if number is greater than 10',
          language: 'python',
          starterCode: 'number = 15\n# Write if statement\n',
          solution: 'number = 15\nif number > 10:\n    print("Big")',
          hint: 'Use if number > 10:'
        }
      }
    ]
  },
  {
    id: 3,
    title: 'Functions',
    description: 'Create reusable code',
    lessons: [
      {
        id: 1,
        title: 'Creating Functions',
        duration: '5 min',
        content: `
# Functions

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("Carlos")
\`\`\`
        `,
        exercise: {
          instruction: 'Create a function "say_hi" that prints "Hi!"',
          language: 'python',
          starterCode: '# Create function\n',
          solution: 'def say_hi():\n    print("Hi!")\n\nsay_hi()',
          hint: 'Use def function_name():'
        }
      }
    ]
  }
]

export const getModule = (moduleId) => {
  return MODULES.find(m => m.id === moduleId)
}

export const getLesson = (moduleId, lessonId) => {
  const module = getModule(moduleId)
  if (!module) return null
  return module.lessons.find(l => l.id === lessonId)
}