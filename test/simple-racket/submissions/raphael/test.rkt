
#lang racket/base

(require "sort.rkt")
(require rackunit)

(check-equal? (my-sort '(3 2 1)) '(2 3))

