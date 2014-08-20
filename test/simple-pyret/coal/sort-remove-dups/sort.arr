provide *
fun sort(list-of-number):
  sorted = list-of-number.sort(_ <= _, _ == _)
  fun remove-dups(l):
    cases(List) l:
      | empty => empty
      | link(f, r) =>
        if r.member(f): remove-dups(r)
        else: link(f, remove-dups(r))
        end
    end
  end
  remove-dups(sorted)
end

