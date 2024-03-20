:- use_module(library(clpfd)).

:- op(650, xfy, <).
:- op(650, xfy, >).
:- op(650, xfy, =).

nth0_matrix(X, Y, Matrix, Value) :-
    nth0(Y, Matrix, Row),
    nth0(X, Row, Value).

constraint_holds(Matrix, (X1,Y1)>(X2,Y2)) :-
  nth0_matrix(X1, Y1, Matrix, Elem1),
  nth0_matrix(X2, Y2, Matrix, Elem2),
  Elem1 #> Elem2.
constraint_holds(Matrix, (X1,Y1)<(X2,Y2)) :-
  nth0_matrix(X1, Y1, Matrix, Elem1),
  nth0_matrix(X2, Y2, Matrix, Elem2),
  Elem1 #< Elem2.
constraint_holds(Matrix, (X,Y)=L) :-
  nth0_matrix(X, Y, Matrix, Elem),
  list_to_fdset(L, Set),
  Elem in_set Set.

solve_futoshiki(Size, Constraints, Board) :-
  length(Board, Size),
  maplist(same_length(Board), Board),

  append(Board, Values), 
  Values ins 1..Size, 
  maplist(all_distinct, Board), 

  transpose(Board, BoardRotated),
  maplist(all_distinct, BoardRotated), 

  maplist(constraint_holds(Board), Constraints),
  maplist(label, Board).