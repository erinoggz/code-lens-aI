export const FunctionQuery = `
;; Named function declarations
(function_declaration
  name: (identifier) @name) @function

;; Exported named functions
(export_statement
  (function_declaration
    name: (identifier) @name)) @function

;; Arrow functions assigned to variables
(variable_declarator
  name: (identifier) @name
  value: (arrow_function)) @function

;; Exported default anonymous function declaration
(export_statement
  (function_declaration) @function) @default_anon

;; Exported default anonymous function expression
(export_statement
  (function_expression) @function)

;; Exported default arrow function
(export_statement
  (arrow_function) @function)

;; Function expressions assigned to variables
(variable_declarator
  name: (identifier) @name
  value: (function_expression)) @function

;; Arrow functions inside object literals
(pair
  key: (property_identifier) @name
  value: (arrow_function)) @function

;; IIFE (Immediately Invoked Function Expression)
(call_expression
  function: (parenthesized_expression
    (function_expression
      name: (identifier) @name)) @function) @iife

;; Class declarations
(class_declaration
  name: (identifier) @name) @class

;; Class expressions
(variable_declarator
  name: (identifier) @name
  value: (class)) @class

;; Method definitions
(method_definition
  name: (property_identifier) @name) @method

;; Constructors
(method_definition
  name: (property_identifier) @name
  (#eq? @name "constructor")) @constructor

;; Object literal methods
(pair
  key: (property_identifier) @name
  value: (function_expression)) @method

;; Object method shorthand
(method_definition
  name: (property_identifier) @name) @method

;; Callback arrow functions
(call_expression
  arguments: (arguments 
    (arrow_function) @function))

`;


export const VariableQuery = `
;; Constant declarations
(lexical_declaration
  "const" @const_keyword
  (variable_declarator
    name: (identifier) @name)) @const_declaration

;; Let declarations
(lexical_declaration
  "let" @let_keyword
  (variable_declarator
    name: (identifier) @name)) @let_declaration

;; Var declarations
(variable_declaration
  "var" @var_keyword
  (variable_declarator
    name: (identifier) @name)) @var_declaration

;; Variable with initial value
(variable_declarator
  name: (identifier) @name
  value: (_) @value) @var_with_value

;; Exported variables
(export_statement
  (lexical_declaration
    (variable_declarator
      name: (identifier) @name))) @exported_var

;; Variable references/usage
(identifier) @var_reference
`;

export const ClassQuery = `
;; Class declarations
(class_declaration
  name: (identifier) @name) @class

;; Class expressions
(variable_declarator
  name: (identifier) @name
  value: (class)) @class_expr

;; Method definitions
(method_definition
  name: (property_identifier) @name) @method

;; Constructor method
(method_definition
  name: (property_identifier) @name
  (#eq? @name "constructor")) @constructor

;; capture the class _node_ when it’s on the RHS of a var or export
(variable_declarator
  name: (identifier) @name
  value: (class
    (identifier)?     ; optional inner name
    body: (class_body) @body) @class_expr)

  
`;


export const ImportQuery =`
; Import statements
(import_statement
  source: (string) @import_source
  (import_specifier
    name: (identifier) @import_specifier)?
  (import_clause
    (identifier) @import_default)?
) @import_statement

; Require statements
(call_expression
  function: (identifier) @require
  arguments: (arguments (string) @require_path))
`;

export const ExportQuery = `;; Export query for JavaScript/TypeScript

;; Named exports - export { x, y as z }
(export_statement
  (export_clause
    (export_specifier) @export_specifier)
) @named_export

;; Default export - export default x
(export_statement
  "default" @default_keyword
  (_) @default_value
) @default_export

;; Export declaration - export function x() {}, export class X {}, export const x = 1
(export_statement
  declaration: (_) @declaration
) @export_declaration

;; Re-export from - export { x } from 'module'
(export_statement
  source: (string) @source
) @export_from

;; Export all - export * from 'module'
(export_statement
  "*" @star
  source: (string) @source
) @export_all

;; Extract names for more detailed analysis
(export_specifier
  name: (identifier) @export_name
) @export_spec

;; Extract "as" clauses
(export_specifier
  name: (identifier) @original_name
  "as"
  alias: (identifier) @alias_name
) @export_with_alias

;; For declaration exports, extract names
(function_declaration
  name: (identifier) @function_name
) @exported_function

(class_declaration
  name: (identifier) @class_name
) @exported_class

(variable_declaration
  (variable_declarator
    name: (identifier) @variable_name)
) @exported_variable
`

export const CallQuery  = `
;; All function calls with their context in one comprehensive query
;; Direct function calls
(call_expression
  function: (identifier) @callee) @call

;; Method calls with object context
(call_expression
  function: (member_expression
    object: (_) @object
    property: (property_identifier) @method)) @method_call

;; Nested calls (function calls inside function calls)
(call_expression
  function: (_) @outer_function
  arguments: (arguments 
    (call_expression) @nested_call)) @outer_call

;; Immediately Invoked Function Expressions (IIFEs)
(call_expression
  function: [(function_expression) (arrow_function) (parenthesized_expression)] @iife_function) @iife

;; Call expressions in assignment context
(assignment_expression
  right: (call_expression) @call_in_assignment) @assignment

;; Call expressions in variable declarations
(variable_declarator
  value: (call_expression) @call_in_declaration) @declaration

;; Call expressions in return statements
(return_statement
  (call_expression) @call_in_return) @return
`;
