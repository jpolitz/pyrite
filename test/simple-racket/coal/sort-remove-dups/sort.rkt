#lang racket

(provide my-sort)

(define (my-sort l)
  (remove-duplicates (sort l (lambda (l r) (< l r)))))

