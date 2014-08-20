#lang racket

(provide my-sort)

(define (my-sort l)
  (sort l (lambda (l r) (> l r))))

