import "sort.arr" as S

check:
  S.sort([list: 1, 2, 2]) is [list: 1, 2, 2]
  S.sort([list:]) is [list:]
  S.sort([list: 3, 2, 1]) is [list: 3, 2, 1]
end

