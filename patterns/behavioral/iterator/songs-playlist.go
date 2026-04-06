package main

import "iter"

type Interator[T any] interface {
	HasNext() bool
	Next() T
}

type Interable[T any] interface {
	Iter() Interator[T]
}

type song struct {
	name string
}

type playlist struct {
	name  string
	songs []song
}

func newPlaylist(name string) *playlist {
	return &playlist{
		name:  name,
		songs: []song{},
	}
}

func (p *playlist) AddSong(s song) {
	p.songs = append(p.songs, s)
}

func (p *playlist) Iter() Interator[song] {
	return &playlistInterator{
		playlist: p,
		index:    0,
	}
}

func (p *playlist) All() iter.Seq[song] { // range-over-func
	return func(yield func(song) bool) {
		for _, s := range p.songs {
			if !yield(s) {
				return
			}
		}
	}
}

type playlistInterator struct {
	playlist *playlist
	index    int
}

func (i *playlistInterator) HasNext() bool {
	return i.index < len(i.playlist.songs)
}

func (i *playlistInterator) Next() song {
	s := i.playlist.songs[i.index]
	i.index++
	return s
}

func main() {
	p := newPlaylist("My Bhojpuri Vibe")
	p.AddSong(song{name: "sorry sorry"})
	p.AddSong(song{name: "saniya davatare"})
	p.AddSong(song{name: "mahrun color sadiya"})

	iter := p.Iter()
	for iter.HasNext() {
		s := iter.Next()
		println(s.name)
	}

	for song := range p.All() {
		println(song.name)
	}
}
