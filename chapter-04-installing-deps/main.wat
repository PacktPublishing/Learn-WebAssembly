(module
  (type $t0 (func (param i32)))
  (type $t1 (func (param i32 i32) (result i32)))
  (type $t2 (func))
  (type $t3 (func (result f64)))
  (import "env" "table" (table $env.table 2 anyfunc))
  (import "env" "memoryBase" (global $env.memoryBase i32))
  (import "env" "tableBase" (global $env.tableBase i32))
  (import "env" "abort" (func $env.abort (type $t0)))
  (func $_addTwoNumbers (type $t1) (param $p0 i32) (param $p1 i32) (result i32)
    get_local $p1
    get_local $p0
    i32.add)
  (func $runPostSets (type $t2)
    nop)
  (func $__post_instantiate (type $t2)
    get_global $env.memoryBase
    set_global $g2
    get_global $g2
    i32.const 5242880
    i32.add
    set_global $g3)
  (func $f4 (type $t3) (result f64)
    i32.const 0
    call $env.abort
    f64.const 0x0p+0 (;=0;))
  (global $g2 (mut i32) (i32.const 0))
  (global $g3 (mut i32) (i32.const 0))
  (global $fp$_addTwoNumbers i32 (i32.const 1))
  (export "__post_instantiate" (func $__post_instantiate))
  (export "_addTwoNumbers" (func $_addTwoNumbers))
  (export "runPostSets" (func $runPostSets))
  (export "fp$_addTwoNumbers" (global 4))
  (elem (get_global $env.tableBase) $f4 $_addTwoNumbers))
