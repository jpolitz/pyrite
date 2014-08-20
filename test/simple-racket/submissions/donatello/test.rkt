#lang racket/base

(require "sort.rkt")
(require rackunit)

(check-equal (my-sort '(3 3 3)) '(3))
(check-equal (my-sort '()) '())

