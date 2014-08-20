#lang racket/base

(require "sort.rkt")
(require rackunit)

(check-equal (my-sort '()) '())
(check-equal (my-sort '(1 2 3)) '(1 2 3))

