#lang racket/base

(require "sort.rkt")
(require rackunit)

(check-equal (my-sort '(3 3 2 2 1)) '(1 2 3))
(check-equal (my-sort '()) '())
(check-equal (my-sort '(1 2 3)) '(1 2 3))

